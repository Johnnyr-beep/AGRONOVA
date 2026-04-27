using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MataderoAPI.Models;
using MataderoAPI.DTOs;
using MataderoAPI.Data;
using Microsoft.Extensions.Logging;

namespace MataderoAPI.Services
{
    public interface IDespachoService
    {
        Task<DespachoDTO> CrearDespachoAsync(CrearDespachoDTO dto, Guid responsableId);
        Task<DespachoDTO> ObtenerDespachoByIdAsync(Guid id);
        Task<List<DespachoDTO>> ObtenerTodosDespachosAsync();
        Task<DespachoDTO> ActualizarDespachoAsync(Guid id, ActualizarDespachoDTO dto);
        Task<bool> EliminarDespachoAsync(Guid id);
        Task<bool> ConfirmarEntregaAsync(Guid id);
    }

    public class DespachoService : IDespachoService
    {
        private readonly MataderoContext _context;
        private readonly ILogger<DespachoService> _logger;

        public DespachoService(MataderoContext context, ILogger<DespachoService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<DespachoDTO> CrearDespachoAsync(CrearDespachoDTO dto, Guid responsableId)
        {
            // Calculate total weight and amount based on selected products if they were loaded here, 
            // for simplicity assuming products are fetched and mapped
            var despacho = new Despacho
            {
                NumeroDespacho = $"DESP-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString()[..6]}",
                ClienteId = dto.ClienteId,
                DireccionDestino = dto.DireccionDestino,
                PatentaVehiculo = dto.PatentaVehiculo,
                TransportistaNombre = dto.TransportistaNombre,
                TemperaturaVehiculo = dto.TemperaturaVehiculo,
                NumeroSelloRefrigeracion = dto.NumeroSelloRefrigeracion,
                ResponsableDespachoId = responsableId,
                Estado = EstadoDespacho.Pendiente,
                FechaDespacho = DateTime.Now,
                AprobadoDespacho = dto.TemperaturaVehiculo <= 5 // Rule: Temperature must be <= 5°C
            };

            await _context.Despachos.AddAsync(despacho);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Despacho creado: {despacho.NumeroDespacho}");

            return MapToDTO(despacho);
        }

        public async Task<DespachoDTO> ObtenerDespachoByIdAsync(Guid id)
        {
            var despacho = await _context.Despachos
                .Include(d => d.Cliente)
                .Include(d => d.ResponsableDespacho)
                .FirstOrDefaultAsync(d => d.Id == id && !d.Eliminado);

            return MapToDTO(despacho);
        }

        public async Task<List<DespachoDTO>> ObtenerTodosDespachosAsync()
        {
            var despachos = await _context.Despachos
                .Include(d => d.Cliente)
                .Where(d => !d.Eliminado)
                .OrderByDescending(d => d.FechaDespacho)
                .ToListAsync();

            return despachos.Select(MapToDTO).ToList();
        }

        public async Task<DespachoDTO> ActualizarDespachoAsync(Guid id, ActualizarDespachoDTO dto)
        {
            var despacho = await _context.Despachos.FirstOrDefaultAsync(d => d.Id == id && !d.Eliminado);
            if (despacho == null) return null;

            despacho.Estado = dto.Estado;
            despacho.FechaSalida = dto.FechaSalida ?? despacho.FechaSalida;
            despacho.FechaEntregaConfirmada = dto.FechaEntregaConfirmada ?? despacho.FechaEntregaConfirmada;
            despacho.NumeroGuiaTransporte = dto.NumeroGuiaTransporte ?? despacho.NumeroGuiaTransporte;
            despacho.NumeroFactura = dto.NumeroFactura ?? despacho.NumeroFactura;
            despacho.ObservacionesDespacho = dto.ObservacionesDespacho ?? despacho.ObservacionesDespacho;
            despacho.AprobadoDespacho = dto.AprobadoDespacho;

            await _context.SaveChangesAsync();

            return MapToDTO(despacho);
        }

        public async Task<bool> EliminarDespachoAsync(Guid id)
        {
            var despacho = await _context.Despachos.FirstOrDefaultAsync(d => d.Id == id && !d.Eliminado);
            if (despacho == null) return false;

            despacho.Eliminado = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ConfirmarEntregaAsync(Guid id)
        {
            var despacho = await _context.Despachos.FirstOrDefaultAsync(d => d.Id == id && !d.Eliminado);
            if (despacho == null) return false;

            despacho.Estado = EstadoDespacho.Entregado;
            despacho.FechaEntregaConfirmada = DateTime.Now;
            
            await _context.SaveChangesAsync();
            return true;
        }

        private DespachoDTO MapToDTO(Despacho d)
        {
            if (d == null) return null;
            return new DespachoDTO
            {
                Id = d.Id,
                NumeroDespacho = d.NumeroDespacho,
                FechaDespacho = d.FechaDespacho,
                Estado = d.Estado,
                ClienteNombre = d.Cliente?.Nombre ?? d.Cliente?.RazonSocial ?? "Sin Asignar",
                DireccionDestino = d.DireccionDestino,
                PatentaVehiculo = d.PatentaVehiculo,
                TransportistaNombre = d.TransportistaNombre,
                FechaSalida = d.FechaSalida,
                FechaEntregaConfirmada = d.FechaEntregaConfirmada,
                PesoTotalKg = d.PesoTotalKg,
                CantidadProductos = d.CantidadProductos,
                TemperaturaVehiculo = d.TemperaturaVehiculo,
                NumeroSelloRefrigeracion = d.NumeroSelloRefrigeracion,
                NumeroGuiaTransporte = d.NumeroGuiaTransporte,
                NumeroFactura = d.NumeroFactura,
                ObservacionesDespacho = d.ObservacionesDespacho,
                AprobadoDespacho = d.AprobadoDespacho
            };
        }
    }
}
