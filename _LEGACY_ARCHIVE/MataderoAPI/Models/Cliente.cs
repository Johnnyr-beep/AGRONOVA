using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Modelo de Cliente que recibe los productos despachados
    /// </summary>
    public class Cliente
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
        public string Observaciones { get; set; }
        
        // Relaciones
        public virtual ICollection<Despacho> Despachos { get; set; } = new List<Despacho>();
        
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public DateTime? FechaModificacion { get; set; }
        public bool Eliminado { get; set; } = false;
    }
}
