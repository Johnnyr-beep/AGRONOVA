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
    public class DesposteController : ControllerBase
    {
        private readonly IDesposteService _desposteService;

        public DesposteController(IDesposteService desposteService)
        {
            _desposteService = desposteService;
        }

        // GET: api/desposte
        [HttpGet]
        public async Task<ActionResult<List<DesposteDTO>>> GetAllDespostes()
        {
            try
            {
                var despostes = await _desposteService.ObtenerTodosDespostesAsync();
                return Ok(despostes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/desposte/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DesposteDTO>> GetDesposteById(Guid id)
        {
            try
            {
                var desposte = await _desposteService.ObtenerDesposteByIdAsync(id);
                if (desposte == null)
                    return NotFound(new { error = "Desposte no encontrado" });

                return Ok(desposte);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/desposte/canal/{canalId}
        [HttpGet("canal/{canalId}")]
        public async Task<ActionResult<List<DesposteDTO>>> GetDespostesByCanal(Guid canalId)
        {
            try
            {
                var despostes = await _desposteService.ObtenerDespostesByCanalIdAsync(canalId);
                return Ok(despostes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/desposte
        [HttpPost]
        [Authorize(Roles = "Supervisor,OperarioDesposte")]
        public async Task<ActionResult<DesposteDTO>> CreateDesposte([FromBody] CrearDesposteDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var desposte = await _desposteService.CrearDesposteAsync(dto);
                return CreatedAtAction(nameof(GetDesposteById), new { id = desposte.Id }, desposte);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/desposte/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Supervisor,OperarioDesposte")]
        public async Task<ActionResult<DesposteDTO>> UpdateDesposte(Guid id, [FromBody] ActualizarDesposteDTO dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest(new { error = "ID no coincide" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var desposte = await _desposteService.ActualizarDesposteAsync(dto);
                if (desposte == null)
                    return NotFound(new { error = "Desposte no encontrado" });

                return Ok(desposte);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/desposte/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Supervisor,Administrador")]
        public async Task<ActionResult> DeleteDesposte(Guid id)
        {
            try
            {
                var success = await _desposteService.EliminarDesposteAsync(id);
                if (!success)
                    return NotFound(new { error = "Desposte no encontrado" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/desposte/reporte
        [HttpGet("reportes/periodo")]
        [Authorize(Roles = "Supervisor,ReportesAnalítica,Administrador")]
        public async Task<ActionResult<DesposteReporteDTO>> GetReporteDesposte(
            [FromQuery] DateTime fechaInicio,
            [FromQuery] DateTime fechaFin)
        {
            try
            {
                var reporte = await _desposteService.ObtenerReporteDesposteAsync(fechaInicio, fechaFin);
                return Ok(reporte);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
