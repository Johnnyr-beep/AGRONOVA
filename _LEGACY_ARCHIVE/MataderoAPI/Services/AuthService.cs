using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MataderoAPI.Data;
using MataderoAPI.DTOs;
using System.Linq;

namespace MataderoAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly MataderoContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(MataderoContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<TokenResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.UsuarioRoles)
                    .ThenInclude(ur => ur.Rol)
                .FirstOrDefaultAsync(u => u.NombreUsuario == loginDto.NombreUsuario && !u.Eliminado);

            if (usuario == null || !usuario.Activo)
            {
                return null;
            }

            bool isPasswordValid = false;
            try
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, usuario.PasswordHash);
            }
            catch
            {
                // Fallback for non-hashed plain-text passwords
                if (usuario.PasswordHash == loginDto.Password) {
                    isPasswordValid = true;
                }
            }

            if (!isPasswordValid)
            {
                return null;
            }

            usuario.UltimoAcceso = DateTime.Now;
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.NombreUsuario),
                new Claim("TipoEmpleado", ((int)usuario.TipoEmpleado).ToString())
            };

            foreach (var userRole in usuario.UsuarioRoles)
            {
                if (userRole.Rol != null)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole.Rol.Nombre));
                }
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? string.Empty));
            int expirationMinutes = int.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "1440");
            var expirationDate = DateTime.Now.AddMinutes(expirationMinutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: expirationDate,
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new TokenResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiracion = expirationDate,
                Usuario = new UsuarioAuthInfoDto
                {
                    Id = usuario.Id,
                    NombreUsuario = usuario.NombreUsuario,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    Email = usuario.Email,
                    TipoEmpleado = (int)usuario.TipoEmpleado
                }
            };
        }
    }
}
