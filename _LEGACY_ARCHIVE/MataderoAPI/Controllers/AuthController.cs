using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MataderoAPI.DTOs;
using MataderoAPI.Services;

namespace MataderoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);

            if (result == null)
            {
                return Unauthorized(new { message = "Usuario o contraseña incorrectos, o el usuario está inactivo." });
            }

            return Ok(result);
        }
    }
}
