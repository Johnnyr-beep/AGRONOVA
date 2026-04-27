using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MataderoAPI.DTOs;
using MataderoAPI.Services;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace MataderoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BasculaController : ControllerBase
    {
        private readonly IBasculaService _basculaService;
        private readonly ILogger<BasculaController> _logger;

        public BasculaController(IBasculaService basculaService, ILogger<BasculaController> logger)
        {
            _basculaService = basculaService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<BasculaDTO>>> GetAll()
        {
            try
            {
                var basculas = await _basculaService.ObtenerTodasBasculasAsync();
                return Ok(basculas);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener básculas: {ex.Message}");
                return BadRequest(new { message = "Error al obtener básculas" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BasculaDTO>> GetById(Guid id)
        {
            try
            {
                var bascula = await _basculaService.ObtenerBasculaByIdAsync(id);
                if (bascula == null) return NotFound();
                return Ok(bascula);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener báscula {id}: {ex.Message}");
                return BadRequest(new { message = "Error al obtener báscula" });
            }
        }

        [HttpGet("reportes/periodo")]
        public async Task<ActionResult<List<BasculaDTO>>> GetReportePeriodo([FromQuery] string fechaInicio, [FromQuery] string fechaFin)
        {
            try
            {
                var inicio = DateTime.Parse(fechaInicio, CultureInfo.InvariantCulture);
                var fin = DateTime.Parse(fechaFin, CultureInfo.InvariantCulture);
                var data = await _basculaService.ObtenerReporteBasculaPeriodoAsync(inicio, fin);
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error reporte báscula período: {ex.Message}");
                return BadRequest(new { message = "Error al generar reporte de báscula" });
            }
        }

        [HttpGet("reportes/periodo/excel")]
        public async Task<IActionResult> DownloadReportePeriodoExcel([FromQuery] string fechaInicio, [FromQuery] string fechaFin)
        {
            try
            {
                var inicio = DateTime.Parse(fechaInicio, CultureInfo.InvariantCulture);
                var fin = DateTime.Parse(fechaFin, CultureInfo.InvariantCulture);
                var bytes = await _basculaService.GenerarReporteBasculaPeriodoCsvAsync(inicio, fin);

                var filename = $"reporte_bascula_{inicio:yyyyMMdd}_{fin:yyyyMMdd}.csv";
                return File(bytes, "text/csv; charset=utf-8", filename);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error descarga reporte báscula excel: {ex.Message}");
                return BadRequest(new { message = "Error al descargar reporte de báscula" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<BasculaDTO>> Create([FromBody] CrearBasculaDTO dto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var operarioId = Guid.Parse(User.FindFirst("sub")?.Value ?? Guid.Empty.ToString());
                var bascula = await _basculaService.CrearBasculaAsync(dto, operarioId);
                return CreatedAtAction(nameof(GetById), new { id = bascula.Id }, bascula);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al crear báscula: {ex.Message}");
                return BadRequest(new { message = "Error al registrar báscula" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BasculaDTO>> Update(Guid id, [FromBody] ActualizarBasculaDTO dto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var bascula = await _basculaService.ActualizarBasculaAsync(id, dto);
                if (bascula == null) return NotFound();
                return Ok(bascula);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al actualizar báscula {id}: {ex.Message}");
                return BadRequest(new { message = "Error al actualizar báscula" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(Guid id)
        {
            try
            {
                var success = await _basculaService.EliminarBasculaAsync(id);
                if (!success) return NotFound();
                return Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al eliminar báscula {id}: {ex.Message}");
                return BadRequest(new { message = "Error al eliminar báscula" });
            }
        }
    }
}
