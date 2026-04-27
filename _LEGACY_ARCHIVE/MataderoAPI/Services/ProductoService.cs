using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MataderoAPI.Models;
using MataderoAPI.DTOs;

namespace MataderoAPI.Services
{
    public interface IProductoService
    {
        Task<TipoProductoDTO> CrearTipoProductoAsync(CrearTipoProductoDTO dto);
        Task<TipoProductoDTO> ObtenerTipoProductoByIdAsync(Guid id);
        Task<List<TipoProductoDTO>> ObtenerTodosTiposProductosAsync();
        Task<TipoProductoDTO> ActualizarTipoProductoAsync(ActualizarTipoProductoDTO dto);
        Task<bool> EliminarTipoProductoAsync(Guid id);
    }

    public class ProductoService : IProductoService
    {
        // private readonly IProductoRepository _repository;

        public async Task<TipoProductoDTO> CrearTipoProductoAsync(CrearTipoProductoDTO dto)
        {
            var tipoProducto = new TipoProducto
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                Codigo = dto.Codigo,
                Clasificacion = dto.Clasificacion,
                PrecioBaseKg = dto.PrecioBaseKg,
                PesoMinimo = dto.PesoMinimo,
                PesoMaximo = dto.PesoMaximo,
                RequiereControlCalidad = dto.RequiereControlCalidad,
                TemperaturaOptima = dto.TemperaturaOptima,
                DiasVidaUtil = dto.DiasVidaUtil,
                Activo = true
            };

            // TODO: await _repository.AddAsync(tipoProducto);
            // TODO: await _repository.SaveChangesAsync();

            return MapTipoProductoToDTO(tipoProducto);
        }

        public async Task<TipoProductoDTO> ObtenerTipoProductoByIdAsync(Guid id)
        {
            // TODO: var tipoProducto = await _repository.GetByIdAsync(id);
            // return MapTipoProductoToDTO(tipoProducto);
            return null;
        }

        public async Task<List<TipoProductoDTO>> ObtenerTodosTiposProductosAsync()
        {
            // TODO: var tiposProductos = await _repository.GetAllActiveAsync();
            // return tiposProductos.Select(MapTipoProductoToDTO).ToList();
            return new List<TipoProductoDTO>();
        }

        public async Task<TipoProductoDTO> ActualizarTipoProductoAsync(ActualizarTipoProductoDTO dto)
        {
            // TODO: var tipoProducto = await _repository.GetByIdAsync(dto.Id);
            // TODO: Actualizar propiedades
            // TODO: await _repository.SaveChangesAsync();
            return null;
        }

        public async Task<bool> EliminarTipoProductoAsync(Guid id)
        {
            // TODO: var tipoProducto = await _repository.GetByIdAsync(id);
            // TODO: tipoProducto.Activo = false;
            // TODO: await _repository.SaveChangesAsync();
            return true;
        }

        private TipoProductoDTO MapTipoProductoToDTO(TipoProducto tipoProducto)
        {
            if (tipoProducto == null) return null;

            return new TipoProductoDTO
            {
                Id = tipoProducto.Id,
                Nombre = tipoProducto.Nombre,
                Descripcion = tipoProducto.Descripcion,
                Codigo = tipoProducto.Codigo,
                Clasificacion = tipoProducto.Clasificacion.ToString(),
                PrecioBaseKg = tipoProducto.PrecioBaseKg,
                PesoMinimo = tipoProducto.PesoMinimo,
                PesoMaximo = tipoProducto.PesoMaximo,
                RequiereControlCalidad = tipoProducto.RequiereControlCalidad,
                TemperaturaOptima = tipoProducto.TemperaturaOptima,
                DiasVidaUtil = tipoProducto.DiasVidaUtil,
                Activo = tipoProducto.Activo
            };
        }
    }
}
