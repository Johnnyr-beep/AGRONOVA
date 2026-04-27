using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Modelo para la canal que viene de faena (matanza)
    /// </summary>
    public class Canal
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // Identificación
        public string NumeroCanal { get; set; } // ID único de la canal (ej: CANAL-001-2026)
        public string NumeroOreja { get; set; } // Número de oreja del animal
        
        // Información del ingreso (báscula)
        public Guid? BasiculaId { get; set; }
        public virtual Bascula Bascula { get; set; }
        
        // Datos del animal
        public TipoAnimal TipoAnimal { get; set; } // Bovino, Porcino, etc
        public decimal PesoVivo { get; set; } // Peso cuando ingresa
        public decimal PesoCanalCaliente { get; set; } // Peso de la canal recién faenada
        public decimal PesoCanalFria { get; set; } // Peso después de refrigeración
        
        // Fechas importantes
        public DateTime FechaFaena { get; set; }
        public DateTime? FechaRefrigeracion { get; set; }
        
        // Estado de la canal
        public EstadoCanal Estado { get; set; } = EstadoCanal.Faenada;
        
        // Control de calidad en faena
        public bool AptilizadoFaena { get; set; } = true;
        public string ObservacionesFaena { get; set; }
        
        // Información del proveedor/ganadero
        public Guid? ProveedorId { get; set; }
        public virtual Proveedor Proveedor { get; set; }
        
        // Desposte
        public Guid? DesposteId { get; set; }
        public virtual Desposte Desposte { get; set; }
        public DateTime? FechaDesposte { get; set; }
        
        // Productos finales
        public virtual ICollection<ProductoDesposte> ProductosDesposte { get; set; } = new List<ProductoDesposte>();
        
        // Trazabilidad
        public string CodigoQR { get; set; } // Para trazabilidad
        
        // Auditoría
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public Guid? CreadoPor { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public Guid? ModificadoPor { get; set; }
        public bool Eliminado { get; set; } = false;
    }

    public enum EstadoCanal
    {
        Faenada = 0,
        Refrigerada = 1,
        EnDesposte = 2,
        DesposteCompleto = 3,
        Despachada = 4,
        Cancelada = 5
    }

    public enum TipoAnimal
    {
        Bovino = 0,
        Porcino = 1,
        Ovino = 2,
        Caprino = 3,
        Otro = 4
    }
}
