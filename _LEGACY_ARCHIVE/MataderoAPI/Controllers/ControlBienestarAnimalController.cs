using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MataderoAPI.DTOs;
using MataderoAPI.Services;

namespace MataderoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ControlBienestarAnimalController : ControllerBase
    {
        private readonly IFaenaService _faenaService;
        private readonly ILogger<ControlBienestarAnimalController> _logger;

        public ControlBienestarAnimalController(IFaenaService faenaService, ILogger<ControlBienestarAnimalController> logger)
        {
            _faenaService = faenaService;
            _logger = logger;
        }

        [HttpGet("faena/{faenaId}")]
        [Authorize(Roles = "Supervisor,ControlCalidad,OperarioFaena")]
        public async Task<ActionResult<List<ControlBienestarDTO>>> GetControlesByFaena(Guid faenaId)
        {
            try
            {
                var controles = await _faenaService.ObtenerControlesBienestarByFaenaAsync(faenaId);
                return Ok(controles);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener controles de bienestar: {ex.Message}");
                return BadRequest(new { message = "Error al obtener controles de bienestar" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Supervisor,ControlCalidad")]
        public async Task<ActionResult<bool>> RegistrarControl([FromBody] ControlBienestarAnimalDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var resultado = await _faenaService.RegistrarControlBienestarAsync(dto, usuarioId);
                return Ok(new { success = resultado });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al registrar control: {ex.Message}");
                return BadRequest(new { message = "Error al registrar control de bienestar" });
            }
        }
    }
}
