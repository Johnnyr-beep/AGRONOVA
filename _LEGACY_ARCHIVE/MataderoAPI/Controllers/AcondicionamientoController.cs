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
    public class AcondicionamientoController : ControllerBase
    {
        private readonly IAcondicionamientoService _acondicionamientoService;

        public AcondicionamientoController(IAcondicionamientoService acondicionamientoService)
        {
            _acondicionamientoService = acondicionamientoService;
        }

        // GET: api/acondicionamiento
        [HttpGet]
        public async Task<ActionResult<List<AcondicionamientoDTO>>> GetAllAcondicionamientos()
        {
            try
            {
                var acondicionamientos = await _acondicionamientoService.ObtenerTodosAcondicionamientosAsync();
                return Ok(acondicionamientos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/acondicionamiento/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AcondicionamientoDTO>> GetAcondicionamientoById(Guid id)
        {
            try
            {
                var acondicionamiento = await _acondicionamientoService.ObtenerAcondicionamientoByIdAsync(id);
                if (acondicionamiento == null)
                    return NotFound(new { error = "Acondicionamiento no encontrado" });

                return Ok(acondicionamiento);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/acondicionamiento/desposte/{desposteId}
        [HttpGet("desposte/{desposteId}")]
        public async Task<ActionResult<List<AcondicionamientoDTO>>> GetAcondicionamientosByDesposte(Guid desposteId)
        {
            try
            {
                var acondicionamientos = await _acondicionamientoService.ObtenerAcondicionamientosByDesposteIdAsync(desposteId);
                return Ok(acondicionamientos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/acondicionamiento
        [HttpPost]
        [Authorize(Roles = "Supervisor,OperarioDesposte")]
        public async Task<ActionResult<AcondicionamientoDTO>> CreateAcondicionamiento([FromBody] CrearAcondicionamientoDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var acondicionamiento = await _acondicionamientoService.CrearAcondicionamientoAsync(dto);
                return CreatedAtAction(nameof(GetAcondicionamientoById), new { id = acondicionamiento.Id }, acondicionamiento);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/acondicionamiento/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Supervisor,OperarioDesposte")]
        public async Task<ActionResult<AcondicionamientoDTO>> UpdateAcondicionamiento(Guid id, [FromBody] ActualizarAcondicionamientoDTO dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest(new { error = "ID no coincide" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var acondicionamiento = await _acondicionamientoService.ActualizarAcondicionamientoAsync(dto);
                if (acondicionamiento == null)
                    return NotFound(new { error = "Acondicionamiento no encontrado" });

                return Ok(acondicionamiento);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/acondicionamiento/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Supervisor,Administrador")]
        public async Task<ActionResult> DeleteAcondicionamiento(Guid id)
        {
            try
            {
                var success = await _acondicionamientoService.EliminarAcondicionamientoAsync(id);
                if (!success)
                    return NotFound(new { error = "Acondicionamiento no encontrado" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/acondicionamiento/{id}/aprobar
        [HttpPost("{id}/aprobar")]
        [Authorize(Roles = "Supervisor,ControlCalidad")]
        public async Task<ActionResult<AcondicionamientoDTO>> AprobarAcondicionamiento(Guid id, [FromBody] AprobarAcondicionamientoDTO dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest(new { error = "ID no coincide" });

                var acondicionamiento = await _acondicionamientoService.AprobarAcondicionamientoAsync(dto);
                if (acondicionamiento == null)
                    return NotFound(new { error = "Acondicionamiento no encontrado" });

                return Ok(acondicionamiento);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/acondicionamiento/reportes/periodo
        [HttpGet("reportes/periodo")]
        [Authorize(Roles = "Supervisor,ReportesAnalítica,Administrador")]
        public async Task<ActionResult<AcondicionamientoReporteDTO>> GetReporteAcondicionamiento(
            [FromQuery] DateTime fechaInicio,
            [FromQuery] DateTime fechaFin)
        {
            try
            {
                var reporte = await _acondicionamientoService.ObtenerReporteAcondicionamientoAsync(fechaInicio, fechaFin);
                return Ok(reporte);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
