using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MataderoAPI.DTOs;
using MataderoAPI.Services;
using Microsoft.Extensions.Logging;

namespace MataderoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DespachoController : ControllerBase
    {
        private readonly IDespachoService _despachoService;
        private readonly ILogger<DespachoController> _logger;

        public DespachoController(IDespachoService despachoService, ILogger<DespachoController> logger)
        {
            _despachoService = despachoService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<DespachoDTO>>> GetAll()
        {
            try
            {
                var despachos = await _despachoService.ObtenerTodosDespachosAsync();
                return Ok(despachos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener despachos: {ex.Message}");
                return BadRequest(new { message = "Error al obtener despachos" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DespachoDTO>> GetById(Guid id)
        {
            try
            {
                var despacho = await _despachoService.ObtenerDespachoByIdAsync(id);
                if (despacho == null) return NotFound();
                return Ok(despacho);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener despacho {id}: {ex.Message}");
                return BadRequest(new { message = "Error al obtener despacho" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<DespachoDTO>> Create([FromBody] CrearDespachoDTO dto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                if (dto.TemperaturaVehiculo > 5)
                {
                    return BadRequest(new { message = "La temperatura del vehículo supera el límite permitido (5°C)." });
                }

                var responsableId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var despacho = await _despachoService.CrearDespachoAsync(dto, responsableId);
                return CreatedAtAction(nameof(GetById), new { id = despacho.Id }, despacho);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al crear despacho: {ex.Message}");
                return BadRequest(new { message = "Error al registrar despacho" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DespachoDTO>> Update(Guid id, [FromBody] ActualizarDespachoDTO dto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var despacho = await _despachoService.ActualizarDespachoAsync(id, dto);
                if (despacho == null) return NotFound();
                return Ok(despacho);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al actualizar despacho {id}: {ex.Message}");
                return BadRequest(new { message = "Error al actualizar despacho" });
            }
        }

        [HttpPost("{id}/confirmar")]
        public async Task<ActionResult<bool>> ConfirmarEntrega(Guid id)
        {
            try
            {
                var success = await _despachoService.ConfirmarEntregaAsync(id);
                if (!success) return NotFound();
                return Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al confirmar entrega de despacho {id}: {ex.Message}");
                return BadRequest(new { message = "Error al confirmar entrega" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(Guid id)
        {
            try
            {
                var success = await _despachoService.EliminarDespachoAsync(id);
                if (!success) return NotFound();
                return Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al eliminar despacho {id}: {ex.Message}");
                return BadRequest(new { message = "Error al eliminar despacho" });
            }
        }
    }
}
