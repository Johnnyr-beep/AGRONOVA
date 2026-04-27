using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Tipos de productos que se pueden generar en el desposte
    /// </summary>
    public class TipoProducto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Nombre { get; set; } // Lomo, Costilla, Falda, Asado, Pecho, etc
        public string Descripcion { get; set; }
        public string Codigo { get; set; } // Código interno (ej: LOM001)
        
        // Clasificación
        public ClasificacionProducto Clasificacion { get; set; } // Premium, Estándar, Procesado
        public decimal PrecioBaseKg { get; set; } // Precio base por kilogramo
        
        // Control de calidad
        public decimal PesoMinimo { get; set; } // Peso mínimo permitido
        public decimal PesoMaximo { get; set; } // Peso máximo permitido
        public bool RequiereControlCalidad { get; set; } = true;
        
        // Información de almacenamiento
        public decimal TemperaturaOptima { get; set; } // En Celsius
        public int DiasVidaUtil { get; set; } // Días máximos de almacenamiento
        
        public bool Activo { get; set; } = true;
        
        // Relación con productos desposte
        public virtual ICollection<ProductoDesposte> ProductosDesposte { get; set; } = new List<ProductoDesposte>();
        
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public DateTime? FechaModificacion { get; set; }
    }

    public enum ClasificacionProducto
    {
        Premium = 0,
        Estandar = 1,
        Procesado = 2,
        Subproducto = 3
    }
}
