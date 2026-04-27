using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MataderoAPI.DTOs;
using MataderoAPI.Services;

namespace MataderoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InspeccionVeterinarioController : ControllerBase
    {
        private readonly IFaenaService _faenaService;
        private readonly ILogger<InspeccionVeterinarioController> _logger;

        public InspeccionVeterinarioController(IFaenaService faenaService, ILogger<InspeccionVeterinarioController> logger)
        {
            _faenaService = faenaService;
            _logger = logger;
        }

        [HttpGet("faena/{faenaId}")]
        [Authorize(Roles = "Supervisor,ControlCalidad,OperarioFaena")]
        public async Task<ActionResult<List<InspeccionVeterinarioDTO>>> GetInspeccionesByFaena(Guid faenaId)
        {
            try
            {
                var inspecciones = await _faenaService.ObtenerInspeccionesByFaenaAsync(faenaId);
                return Ok(inspecciones);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener inspecciones: {ex.Message}");
                return BadRequest(new { message = "Error al obtener inspecciones" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Supervisor,ControlCalidad")]
        public async Task<ActionResult<bool>> RegistrarInspeccion([FromBody] InspeccionVeterinarioFaenaDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var resultado = await _faenaService.RegistrarInspeccionVeterinarioAsync(dto, usuarioId);
                return Ok(new { success = resultado });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al registrar inspección: {ex.Message}");
                return BadRequest(new { message = "Error al registrar inspección" });
            }
        }
    }
}
