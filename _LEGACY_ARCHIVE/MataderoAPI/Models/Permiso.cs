using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Modelo de Permiso granular para control de acceso
    /// </summary>
    public class Permiso
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Nombre { get; set; } // Ej: "Ver_Bascula", "Crear_Desposte", "Despachar_Productos"
        public string Descripcion { get; set; }
        public string Modulo { get; set; } // Bascula, Desposte, Despacho, Reportes, Admin
        public string Accion { get; set; } // Ver, Crear, Editar, Eliminar, Aprobar
        
        // Relación con roles
        public virtual ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();
        
        public bool Activo { get; set; } = true;
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}
