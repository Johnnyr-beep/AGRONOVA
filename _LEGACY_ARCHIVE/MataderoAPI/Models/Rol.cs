using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Modelo de Rol con permisos granulares
    /// </summary>
    public class Rol
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public bool Activo { get; set; } = true;
        
        // Relación con usuarios
        public virtual ICollection<UsuarioRol> UsuarioRoles { get; set; } = new List<UsuarioRol>();
        
        // Relación con permisos
        public virtual ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();
        
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public DateTime? FechaModificacion { get; set; }
    }
}
