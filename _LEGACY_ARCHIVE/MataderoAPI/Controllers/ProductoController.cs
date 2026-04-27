using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MataderoAPI.DTOs;
using MataderoAPI.Services;

namespace MataderoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductoController : ControllerBase
    {
        private readonly IProductoService _productoService;

        public ProductoController(IProductoService productoService)
        {
            _productoService = productoService;
        }

        // GET: api/producto
        [HttpGet]
        public async Task<ActionResult<List<TipoProductoDTO>>> GetAllTiposProductos()
        {
            try
            {
                var tipos = await _productoService.ObtenerTodosTiposProductosAsync();
                return Ok(tipos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/producto/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoProductoDTO>> GetTipoProductoById(Guid id)
        {
            try
            {
                var tipo = await _productoService.ObtenerTipoProductoByIdAsync(id);
                if (tipo == null)
                    return NotFound(new { error = "Tipo de producto no encontrado" });

                return Ok(tipo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/producto
        [HttpPost]
        [Authorize(Roles = "Administrador,Supervisor")]
        public async Task<ActionResult<TipoProductoDTO>> CreateTipoProducto([FromBody] CrearTipoProductoDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var tipo = await _productoService.CrearTipoProductoAsync(dto);
                return CreatedAtAction(nameof(GetTipoProductoById), new { id = tipo.Id }, tipo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/producto/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,Supervisor")]
        public async Task<ActionResult<TipoProductoDTO>> UpdateTipoProducto(Guid id, [FromBody] ActualizarTipoProductoDTO dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest(new { error = "ID no coincide" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var tipo = await _productoService.ActualizarTipoProductoAsync(dto);
                if (tipo == null)
                    return NotFound(new { error = "Tipo de producto no encontrado" });

                return Ok(tipo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/producto/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult> DeleteTipoProducto(Guid id)
        {
            try
            {
                var success = await _productoService.EliminarTipoProductoAsync(id);
                if (!success)
                    return NotFound(new { error = "Tipo de producto no encontrado" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
