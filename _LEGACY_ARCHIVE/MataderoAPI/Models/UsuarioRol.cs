using System;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Relación muchos a muchos entre Usuario y Rol
    /// </summary>
    public class UsuarioRol
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid UsuarioId { get; set; }
        public virtual Usuario Usuario { get; set; }
        
        public Guid RolId { get; set; }
        public virtual Rol Rol { get; set; }
        
        public DateTime FechaAsignacion { get; set; } = DateTime.Now;
        public DateTime? FechaExpiracion { get; set; } // Para permisos temporales
    }
}
