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
    public class ControlCalidadAcondicionamientoController : ControllerBase
    {
        private readonly IAcondicionamientoService _acondicionamientoService;

        public ControlCalidadAcondicionamientoController(IAcondicionamientoService acondicionamientoService)
        {
            _acondicionamientoService = acondicionamientoService;
        }

        // GET: api/controlcalidadacondicionamiento/{acondicionamientoId}
        [HttpGet("{acondicionamientoId}")]
        public async Task<ActionResult<ControlCalidadAcondicionamientoDTO>> GetControlCalidadByAcondicionamiento(Guid acondicionamientoId)
        {
            try
            {
                var controlCalidad = await _acondicionamientoService.ObtenerControlCalidadByAcondicionamientoAsync(acondicionamientoId);
                if (controlCalidad == null)
                    return NotFound(new { error = "Control de calidad no encontrado" });

                return Ok(controlCalidad);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/controlcalidadacondicionamiento
        [HttpPost]
        [Authorize(Roles = "Supervisor,ControlCalidad")]
        public async Task<ActionResult<ControlCalidadAcondicionamientoDTO>> RealizarControlCalidad([FromBody] RealizarControlCalidadDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var controlCalidad = await _acondicionamientoService.RealizarControlCalidadAsync(dto);
                return CreatedAtAction(nameof(GetControlCalidadByAcondicionamiento), new { acondicionamientoId = dto.AcondicionamientoId }, controlCalidad);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
