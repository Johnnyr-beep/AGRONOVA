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
    public class ProductoAcondicionadoController : ControllerBase
    {
        private readonly IAcondicionamientoService _acondicionamientoService;

        public ProductoAcondicionadoController(IAcondicionamientoService acondicionamientoService)
        {
            _acondicionamientoService = acondicionamientoService;
        }

        // GET: api/productoacondicionado/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoAcondicionadoDTO>> GetProductoById(Guid id)
        {
            try
            {
                var producto = await _acondicionamientoService.ObtenerProductoAcondicionadoByIdAsync(id);
                if (producto == null)
                    return NotFound(new { error = "Producto acondicionado no encontrado" });

                return Ok(producto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/productoacondicionado/acondicionamiento/{acondicionamientoId}
        [HttpGet("acondicionamiento/{acondicionamientoId}")]
        public async Task<ActionResult<List<ProductoAcondicionadoDTO>>> GetProductosByAcondicionamiento(Guid acondicionamientoId)
        {
            try
            {
                var productos = await _acondicionamientoService.ObtenerProductosByAcondicionamientoIdAsync(acondicionamientoId);
                return Ok(productos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/productoacondicionado
        [HttpPost]
        [Authorize(Roles = "Supervisor,OperarioDesposte")]
        public async Task<ActionResult<ProductoAcondicionadoDTO>> CreateProducto([FromBody] CrearProductoAcondicionadoDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var producto = await _acondicionamientoService.AgregarProductoAcondicionadoAsync(dto);
                return CreatedAtAction(nameof(GetProductoById), new { id = producto.Id }, producto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/productoacondicionado/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Supervisor,OperarioDesposte,ControlCalidad")]
        public async Task<ActionResult<ProductoAcondicionadoDTO>> UpdateProducto(Guid id, [FromBody] ActualizarProductoAcondicionadoDTO dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest(new { error = "ID no coincide" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var producto = await _acondicionamientoService.ActualizarProductoAcondicionadoAsync(dto);
                if (producto == null)
                    return NotFound(new { error = "Producto acondicionado no encontrado" });

                return Ok(producto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/productoacondicionado/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Supervisor,Administrador")]
        public async Task<ActionResult> DeleteProducto(Guid id)
        {
            try
            {
                var success = await _acondicionamientoService.EliminarProductoAcondicionadoAsync(id);
                if (!success)
                    return NotFound(new { error = "Producto acondicionado no encontrado" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
