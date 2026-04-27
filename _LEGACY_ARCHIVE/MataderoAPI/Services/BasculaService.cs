using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MataderoAPI.Models;
using MataderoAPI.DTOs;
using MataderoAPI.Data;
using Microsoft.Extensions.Logging;

namespace MataderoAPI.Services
{
    public interface IBasculaService
    {
        Task<BasculaDTO> CrearBasculaAsync(CrearBasculaDTO dto, Guid operarioId);
        Task<BasculaDTO> ObtenerBasculaByIdAsync(Guid id);
        Task<List<BasculaDTO>> ObtenerTodasBasculasAsync();
        Task<List<BasculaDTO>> ObtenerReporteBasculaPeriodoAsync(DateTime fechaInicio, DateTime fechaFin);
        Task<byte[]> GenerarReporteBasculaPeriodoCsvAsync(DateTime fechaInicio, DateTime fechaFin);
        Task<BasculaDTO> ActualizarBasculaAsync(Guid id, ActualizarBasculaDTO dto);
        Task<bool> EliminarBasculaAsync(Guid id);
    }

    public class BasculaService : IBasculaService
    {
        private readonly MataderoContext _context;
        private readonly ILogger<BasculaService> _logger;

        public BasculaService(MataderoContext context, ILogger<BasculaService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<BasculaDTO> CrearBasculaAsync(CrearBasculaDTO dto, Guid operarioId)
        {
            var pesoVacio = Math.Min(dto.PesoEntradaKg, dto.PesoSalidaKg);
            var pesoLleno = Math.Max(dto.PesoEntradaKg, dto.PesoSalidaKg);

            var bascula = new Bascula
            {
                NumeroTicket = $"TIC-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString()[..6]}",
                NumeroBascula = 1, // Por defecto
                GuiaMovilizacion = dto.GuiaMovilizacion,
                Referencia = dto.Referencia,
                PatentaCamion = dto.PatentaCamion,
                Transportista = dto.Transportista,
                PesoEntradaKg = dto.PesoEntradaKg,
                PesoSalidaKg = dto.PesoSalidaKg,
                PesoVacío = dto.PesoVacio != 0 || dto.PesoLleno != 0 ? dto.PesoVacio : pesoVacio,
                PesoLleno = dto.PesoVacio != 0 || dto.PesoLleno != 0 ? dto.PesoLleno : pesoLleno,
                CantidadAnimales = dto.CantidadAnimales,
                ProveedorId = dto.ProveedorId,
                Procedencia = dto.Procedencia,
                ProveedorNombre = dto.ProveedorNombre,
                ClienteNombre = dto.ClienteNombre,
                Observaciones = dto.Observaciones,
                OperarioId = operarioId,
                FechaIngreso = DateTime.Now
            };

            await _context.Basculas.AddAsync(bascula);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Ticket de báscula generado: {bascula.NumeroTicket}");

            return MapToDTO(bascula);
        }

        public async Task<BasculaDTO> ObtenerBasculaByIdAsync(Guid id)
        {
            var bascula = await _context.Basculas
                .Include(b => b.Operario)
                .Include(b => b.Proveedor)
                .FirstOrDefaultAsync(b => b.Id == id && !b.Eliminado);

            return MapToDTO(bascula);
        }

        public async Task<List<BasculaDTO>> ObtenerTodasBasculasAsync()
        {
            var basculas = await _context.Basculas
                .Include(b => b.Operario)
                .Include(b => b.Proveedor)
                .Where(b => !b.Eliminado)
                .OrderByDescending(b => b.FechaIngreso)
                .ToListAsync();

            return basculas.Select(MapToDTO).ToList();
        }

        public async Task<List<BasculaDTO>> ObtenerReporteBasculaPeriodoAsync(DateTime fechaInicio, DateTime fechaFin)
        {
            // Normalizar rango (inclusive)
            var inicio = fechaInicio.Date;
            var fin = fechaFin.Date.AddDays(1).AddTicks(-1);

            var basculas = await _context.Basculas
                .Include(b => b.Operario)
                .Include(b => b.Proveedor)
                .Where(b => !b.Eliminado && b.FechaIngreso >= inicio && b.FechaIngreso <= fin)
                .OrderByDescending(b => b.FechaIngreso)
                .ToListAsync();

            return basculas.Select(MapToDTO).ToList();
        }

        public async Task<byte[]> GenerarReporteBasculaPeriodoCsvAsync(DateTime fechaInicio, DateTime fechaFin)
        {
            var data = await ObtenerReporteBasculaPeriodoAsync(fechaInicio, fechaFin);
            var sb = new StringBuilder();

            // Excel en es-ES suele abrir mejor con ';' como separador
            sb.AppendLine(string.Join(";", new[]
            {
                "FechaIngreso",
                "NumeroTicket",
                "GuiaMovilizacion",
                "Procedencia",
                "Proveedor",
                "Cliente",
                "Placa",
                "Conductor",
                "Referencia",
                "Cant",
                "EntradaKg",
                "SalidaKg",
                "NetoKg",
                "PromedioKg",
                "Observaciones"
            }));

            foreach (var r in data)
            {
                sb.AppendLine(string.Join(";", new[]
                {
                    Csv(r.FechaIngreso.ToString("yyyy-MM-dd HH:mm")),
                    Csv(r.NumeroTicket),
                    Csv(r.GuiaMovilizacion),
                    Csv(r.Procedencia),
                    Csv(r.ProveedorNombre),
                    Csv(r.ClienteNombre),
                    Csv(r.PatentaCamion),
                    Csv(r.Transportista),
                    Csv(r.Referencia),
                    Csv(r.CantidadAnimales.ToString()),
                    Csv(r.PesoEntradaKg.ToString("0.00")),
                    Csv(r.PesoSalidaKg.ToString("0.00")),
                    Csv(r.PesoNeto.ToString("0.00")),
                    Csv(r.PromedioKg.ToString("0.00")),
                    Csv(r.Observaciones),
                }));
            }

            // UTF-8 con BOM para Excel
            var bom = new byte[] { 0xEF, 0xBB, 0xBF };
            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            var withBom = new byte[bom.Length + bytes.Length];
            Buffer.BlockCopy(bom, 0, withBom, 0, bom.Length);
            Buffer.BlockCopy(bytes, 0, withBom, bom.Length, bytes.Length);
            return withBom;
        }

        public async Task<BasculaDTO> ActualizarBasculaAsync(Guid id, ActualizarBasculaDTO dto)
        {
            var bascula = await _context.Basculas.FirstOrDefaultAsync(b => b.Id == id && !b.Eliminado);
            if (bascula == null) return null;

            bascula.GuiaMovilizacion = dto.GuiaMovilizacion ?? bascula.GuiaMovilizacion;
            bascula.Referencia = dto.Referencia ?? bascula.Referencia;
            bascula.PesoEntradaKg = dto.PesoEntradaKg != 0 ? dto.PesoEntradaKg : bascula.PesoEntradaKg;
            bascula.PesoSalidaKg = dto.PesoSalidaKg != 0 ? dto.PesoSalidaKg : bascula.PesoSalidaKg;
            bascula.PesoVacío = dto.PesoVacio;
            bascula.PesoLleno = dto.PesoLleno;
            bascula.CantidadAnimales = dto.CantidadAnimales;
            bascula.ProveedorNombre = dto.ProveedorNombre ?? bascula.ProveedorNombre;
            bascula.ClienteNombre = dto.ClienteNombre ?? bascula.ClienteNombre;
            bascula.Observaciones = dto.Observaciones;
            bascula.FechaSalida = dto.FechaSalida;

            await _context.SaveChangesAsync();

            return MapToDTO(bascula);
        }

        public async Task<bool> EliminarBasculaAsync(Guid id)
        {
            var bascula = await _context.Basculas.FirstOrDefaultAsync(b => b.Id == id && !b.Eliminado);
            if (bascula == null) return false;

            bascula.Eliminado = true;
            await _context.SaveChangesAsync();
            return true;
        }

        private BasculaDTO MapToDTO(Bascula bascula)
        {
            if (bascula == null) return null;
            var neto = bascula.PesoLleno - bascula.PesoVacío;
            return new BasculaDTO
            {
                Id = bascula.Id,
                NumeroTicket = bascula.NumeroTicket,
                NumeroBascula = bascula.NumeroBascula,
                GuiaMovilizacion = bascula.GuiaMovilizacion,
                Referencia = bascula.Referencia,
                PatentaCamion = bascula.PatentaCamion,
                Transportista = bascula.Transportista,
                PesoEntradaKg = bascula.PesoEntradaKg,
                PesoSalidaKg = bascula.PesoSalidaKg,
                PesoVacio = bascula.PesoVacío,
                PesoLleno = bascula.PesoLleno,
                PesoNeto = neto,
                PromedioKg = bascula.CantidadAnimales > 0 ? neto / bascula.CantidadAnimales : 0,
                CantidadAnimales = bascula.CantidadAnimales,
                ProveedorId = bascula.ProveedorId,
                Procedencia = bascula.Procedencia,
                ProveedorNombre = bascula.ProveedorNombre,
                ClienteNombre = bascula.ClienteNombre,
                FechaIngreso = bascula.FechaIngreso,
                FechaSalida = bascula.FechaSalida,
                Operario = bascula.Operario?.NombreUsuario,
                Observaciones = bascula.Observaciones
            };
        }

        private static string Csv(string value)
        {
            if (string.IsNullOrEmpty(value)) return "";
            var v = value.Replace("\"", "\"\"");
            return $"\"{v}\"";
        }
    }
}
