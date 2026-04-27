using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Modelo para la gestión del desposte (separación y procesamiento de canales)
    /// </summary>
    public class Desposte
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // Relación con Canal
        public Guid CanalId { get; set; }
        public virtual Canal Canal { get; set; }
        
        // Información general del desposte
        public DateTime FechaDesposte { get; set; } = DateTime.Now;
        public string NumeroDesposte { get; set; } // Identificador único (ej: DSP-001-2026)
        
        // Estados: Pendiente, En Proceso, Completado, Cancelado
        public EstadoDesposte Estado { get; set; } = EstadoDesposte.Pendiente;
        
        // Personal responsable
        public Guid? OperarioId { get; set; }
        public virtual Usuario Operario { get; set; }
        
        // Datos de la canal
        public decimal PesoCanalOriginal { get; set; } // Peso de la canal sin desposte
        public DateTime HoraInicio { get; set; }
        public DateTime? HoraFin { get; set; }
        public decimal TiempoProcesoMinutos => HoraFin.HasValue ? (decimal)(HoraFin.Value - HoraInicio).TotalMinutes : 0;
        
        // Pesos de productos finales
        public decimal PesoTotalProductos { get; set; } // Suma de todos los productos
        public decimal PerdidaProcesoKg { get; set; } // Peso que se pierde (grasa, hueso, desperdicio)
        public decimal PorcentajeRendimiento => PesoCanalOriginal > 0 ? (PesoTotalProductos / PesoCanalOriginal) * 100 : 0;
        
        // Productos generados del desposte
        public virtual ICollection<ProductoDesposte> ProductosDesposte { get; set; } = new List<ProductoDesposte>();
        
        // Acondicionamientos generados después del desposte
        public virtual ICollection<Acondicionamiento> Acondicionamientos { get; set; } = new List<Acondicionamiento>();
        
        // Control de calidad
        public string ObservacionesCalidad { get; set; }
        public bool AptilizadoControlCalidad { get; set; } = true;
        
        // Auditoría
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public Guid? CreadoPor { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public Guid? ModificadoPor { get; set; }
        public bool Eliminado { get; set; } = false;
    }

    public enum EstadoDesposte
    {
        Pendiente = 0,
        EnProceso = 1,
        Completado = 2,
        Cancelado = 3
    }
}
