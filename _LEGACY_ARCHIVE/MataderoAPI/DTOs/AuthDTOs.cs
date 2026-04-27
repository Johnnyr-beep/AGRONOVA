using System;
using System.ComponentModel.DataAnnotations;

namespace MataderoAPI.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido")]
        public string NombreUsuario { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida")]
        public string Password { get; set; }
    }

    public class TokenResponseDto
    {
        public string Token { get; set; }
        public DateTime Expiracion { get; set; }
        public UsuarioAuthInfoDto Usuario { get; set; }
    }

    public class UsuarioAuthInfoDto
    {
        public Guid Id { get; set; }
        public string NombreUsuario { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public int TipoEmpleado { get; set; }
    }
}
