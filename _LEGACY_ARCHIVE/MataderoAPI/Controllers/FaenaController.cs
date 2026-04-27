using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MataderoAPI.DTOs;
using MataderoAPI.Models;
using MataderoAPI.Services;

namespace MataderoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FaenaController : ControllerBase
    {
        private readonly IFaenaService _faenaService;
        private readonly ILogger<FaenaController> _logger;

        public FaenaController(IFaenaService faenaService, ILogger<FaenaController> logger)
        {
            _faenaService = faenaService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Supervisor,OperarioFaena,ControlCalidad")]
        public async Task<ActionResult<List<FaenaDTO>>> GetAllFaenas()
        {
            try
            {
                var faenas = await _faenaService.ObtenerTodasFaenasAsync();
                return Ok(faenas);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener faenas: {ex.Message}");
                return BadRequest(new { message = "Error al obtener faenas" });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Supervisor,OperarioFaena,ControlCalidad")]
        public async Task<ActionResult<FaenaDTO>> GetFaenaById(Guid id)
        {
            try
            {
                var faena = await _faenaService.ObtenerFaenaByIdAsync(id);
                if (faena == null)
                    return NotFound();
                return Ok(faena);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener faena: {ex.Message}");
                return BadRequest(new { message = "Error al obtener faena" });
            }
        }

        [HttpGet("bascula/{basculaId}")]
        [Authorize(Roles = "Supervisor,OperarioFaena,ControlCalidad")]
        public async Task<ActionResult<List<FaenaDTO>>> GetFaenasByBascula(Guid basculaId)
        {
            try
            {
                var faenas = await _faenaService.ObtenerFaenasByBasculaAsync(basculaId);
                return Ok(faenas);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener faenas por báscula: {ex.Message}");
                return BadRequest(new { message = "Error al obtener faenas" });
            }
        }

        [HttpGet("estado/{estado}")]
        [Authorize(Roles = "Supervisor,OperarioFaena,ControlCalidad")]
        public async Task<ActionResult<List<FaenaDTO>>> GetFaenasByEstado(EstadoFaena estado)
        {
            try
            {
                var faenas = await _faenaService.ObtenerFaenasByEstadoAsync(estado);
                return Ok(faenas);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener faenas por estado: {ex.Message}");
                return BadRequest(new { message = "Error al obtener faenas" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Supervisor,OperarioFaena")]
        public async Task<ActionResult<FaenaDTO>> CreateFaena([FromBody] CrearFaenaDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var faena = await _faenaService.CrearFaenaAsync(dto, usuarioId);
                return CreatedAtAction(nameof(GetFaenaById), new { id = faena.Id }, faena);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al crear faena: {ex.Message}");
                return BadRequest(new { message = "Error al crear faena" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Supervisor,OperarioFaena")]
        public async Task<ActionResult<FaenaDTO>> UpdateFaena(Guid id, [FromBody] ActualizarFaenaDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var faena = await _faenaService.ActualizarFaenaAsync(id, dto, usuarioId);
                if (faena == null)
                    return NotFound();
                return Ok(faena);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al actualizar faena: {ex.Message}");
                return BadRequest(new { message = "Error al actualizar faena" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Supervisor")]
        public async Task<ActionResult<bool>> DeleteFaena(Guid id)
        {
            try
            {
                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var resultado = await _faenaService.EliminarFaenaAsync(id, usuarioId);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al eliminar faena: {ex.Message}");
                return BadRequest(new { message = "Error al eliminar faena" });
            }
        }

        [HttpPost("{id}/rechazar")]
        [Authorize(Roles = "Supervisor,ControlCalidad")]
        public async Task<ActionResult<FaenaDTO>> RechazarFaena(Guid id, [FromBody] dynamic body)
        {
            try
            {
                var razonRechazo = body.razonRechazo as string;
                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var faena = await _faenaService.RechazarFaenaAsync(id, razonRechazo, usuarioId);
                return Ok(faena);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al rechazar faena: {ex.Message}");
                return BadRequest(new { message = "Error al rechazar faena" });
            }
        }

        [HttpPost("{id}/aprobar")]
        [Authorize(Roles = "Supervisor,ControlCalidad")]
        public async Task<ActionResult<FaenaDTO>> AprobarFaena(Guid id)
        {
            try
            {
                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var faena = await _faenaService.AprobarFaenaAsync(id, usuarioId);
                return Ok(faena);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al aprobar faena: {ex.Message}");
                return BadRequest(new { message = "Error al aprobar faena" });
            }
        }

        [HttpPost("{id}/insensibilizar")]
        [Authorize(Roles = "Supervisor,OperarioFaena")]
        public async Task<ActionResult<bool>> MarcarInsensibilizado(Guid id, [FromBody] dynamic body)
        {
            try
            {
                var metodo = (MetodoInsensibilizacion)body.metodo;
                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var resultado = await _faenaService.MarcarInsensibilizadoAsync(id, metodo, usuarioId);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al marcar insensibilización: {ex.Message}");
                return BadRequest(new { message = "Error al marcar insensibilización" });
            }
        }

        [HttpPost("{id}/desangrar")]
        [Authorize(Roles = "Supervisor,OperarioFaena")]
        public async Task<ActionResult<bool>> MarcarDesangrado(Guid id, [FromBody] dynamic body)
        {
            try
            {
                var metodo = (MetodoDesangre)body.metodo;
                var volumen = (decimal?)body.volumenSangreRecolectado;
                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var resultado = await _faenaService.MarcarDesangradoAsync(id, metodo, volumen, usuarioId);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al marcar desangre: {ex.Message}");
                return BadRequest(new { message = "Error al marcar desangre" });
            }
        }

        [HttpPost("{id}/pelar")]
        [Authorize(Roles = "Supervisor,OperarioFaena")]
        public async Task<ActionResult<bool>> MarcarPelado(Guid id)
        {
            try
            {
                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var resultado = await _faenaService.MarcarPeladoAsync(id, usuarioId);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al marcar pelado: {ex.Message}");
                return BadRequest(new { message = "Error al marcar pelado" });
            }
        }

        [HttpPost("{id}/eviscerar")]
        [Authorize(Roles = "Supervisor,OperarioFaena")]
        public async Task<ActionResult<bool>> MarcarEviscerado(Guid id)
        {
            try
            {
                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var resultado = await _faenaService.MarcarEvisceradoAsync(id, usuarioId);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al marcar evisceración: {ex.Message}");
                return BadRequest(new { message = "Error al marcar evisceración" });
            }
        }

        [HttpPost("{id}/dividir")]
        [Authorize(Roles = "Supervisor,OperarioFaena")]
        public async Task<ActionResult<bool>> MarcarDivision(Guid id)
        {
            try
            {
                var usuarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var resultado = await _faenaService.MarcarDivisionAsync(id, usuarioId);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al marcar división: {ex.Message}");
                return BadRequest(new { message = "Error al marcar división" });
            }
        }

        [HttpGet("reportes/periodo")]
        [Authorize(Roles = "Supervisor,ControlCalidad,ReportesAnalítica")]
        public async Task<ActionResult<List<FaenaReporteDTO>>> GetReporteFaena([FromQuery] DateTime fechaInicio, [FromQuery] DateTime fechaFin)
        {
            try
            {
                var reporte = await _faenaService.ObtenerReporteFaenaAsync(fechaInicio, fechaFin);
                return Ok(reporte);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al generar reporte: {ex.Message}");
                return BadRequest(new { message = "Error al generar reporte" });
            }
        }
    }
}
