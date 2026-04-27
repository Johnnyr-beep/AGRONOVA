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
    public class ProductoDesposteController : ControllerBase
    {
        private readonly IDesposteService _desposteService;

        public ProductoDesposteController(IDesposteService desposteService)
        {
            _desposteService = desposteService;
        }

        // GET: api/productodespote/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDesposteDTO>> GetProductoById(Guid id)
        {
            try
            {
                var producto = await _desposteService.ObtenerProductoDesposteByIdAsync(id);
                if (producto == null)
                    return NotFound(new { error = "Producto no encontrado" });

                return Ok(producto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/productodespote/desposte/{desposteId}
        [HttpGet("desposte/{desposteId}")]
        public async Task<ActionResult<List<ProductoDesposteDTO>>> GetProductosByDesposte(Guid desposteId)
        {
            try
            {
                var productos = await _desposteService.ObtenerProductosByDesposteIdAsync(desposteId);
                return Ok(productos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/productodespote
        [HttpPost]
        [Authorize(Roles = "Supervisor,OperarioDesposte")]
        public async Task<ActionResult<ProductoDesposteDTO>> CreateProducto([FromBody] CrearProductoDesposteDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var producto = await _desposteService.AgregarProductoDesposteAsync(dto);
                return CreatedAtAction(nameof(GetProductoById), new { id = producto.Id }, producto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/productodespote/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Supervisor,OperarioDesposte,OperarioDespacho")]
        public async Task<ActionResult<ProductoDesposteDTO>> UpdateProducto(Guid id, [FromBody] ActualizarProductoDesposteDTO dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest(new { error = "ID no coincide" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var producto = await _desposteService.ActualizarProductoDesposteAsync(dto);
                if (producto == null)
                    return NotFound(new { error = "Producto no encontrado" });

                return Ok(producto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/productodespote/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Supervisor,Administrador")]
        public async Task<ActionResult> DeleteProducto(Guid id)
        {
            try
            {
                var success = await _desposteService.EliminarProductoDesposteAsync(id);
                if (!success)
                    return NotFound(new { error = "Producto no encontrado" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
