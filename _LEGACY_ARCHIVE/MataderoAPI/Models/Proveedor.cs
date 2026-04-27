using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Modelo de Proveedor (Ganadero/Tambero)
    /// </summary>
    public class Proveedor
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Nombre { get; set; }
        public string RazonSocial { get; set; }
        public string RUT { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        
        // Dirección
        public string Direccion { get; set; }
        public string Ciudad { get; set; }
        public string Provincia { get; set; }
        public string CodigoPostal { get; set; }
        
        // Información comercial
        public bool Activo { get; set; } = true;
        public string Contacto { get; set; }
        
        // Relaciones
        public virtual ICollection<Bascula> Basculas { get; set; } = new List<Bascula>();
        public virtual ICollection<Canal> Canales { get; set; } = new List<Canal>();
        
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public DateTime? FechaModificacion { get; set; }
        public bool Eliminado { get; set; } = false;
    }
}
