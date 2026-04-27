using System;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Relación muchos a muchos entre Rol y Permiso
    /// </summary>
    public class RolPermiso
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid RolId { get; set; }
        public virtual Rol Rol { get; set; }
        
        public Guid PermisoId { get; set; }
        public virtual Permiso Permiso { get; set; }
        
        public DateTime FechaAsignacion { get; set; } = DateTime.Now;
    }
}
