using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Modelo de Usuario con roles y permisos
    /// </summary>
    public class Usuario
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string NombreUsuario { get; set; }
        public string PasswordHash { get; set; }
        public string Cedula { get; set; }
        
        // Información de contacto
        public string Telefono { get; set; }
        
        // Información del usuario
        public TipoEmpleado TipoEmpleado { get; set; }
        public DateTime FechaIngreso { get; set; } = DateTime.Now;
        public bool Activo { get; set; } = true;
        
        // Roles y permisos
        public virtual ICollection<UsuarioRol> UsuarioRoles { get; set; } = new List<UsuarioRol>();
        
        // Auditoría
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public DateTime? FechaModificacion { get; set; }
        public DateTime? UltimoAcceso { get; set; }
        public bool Eliminado { get; set; } = false;
    }

    public enum TipoEmpleado
    {
        Administrador = 0,
        Supervisor = 1,
        OperarioBáscula = 2,
        OperarioDesposte = 3,
        OperarioDespacho = 4,
        ControlCalidad = 5,
        ReportesAnalítica = 6
    }
}
