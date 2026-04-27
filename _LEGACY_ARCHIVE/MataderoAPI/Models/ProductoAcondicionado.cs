using System;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Producto individual acondicionado y listo para despacho
    /// </summary>
    public class ProductoAcondicionado
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Relación con Acondicionamiento
        public Guid AcondicionamientoId { get; set; }
        public virtual Acondicionamiento Acondicionamiento { get; set; }

        // Relación con ProductoDesposte original
        public Guid ProductoDesposteId { get; set; }
        public virtual ProductoDesposte ProductoDesposte { get; set; }

        // Información del producto acondicionado
        public string NumeroProductoAcondicionado { get; set; } // Nuevo número con embalaje
        public decimal PesoProducto { get; set; } // Peso del producto
        public decimal PesoEmbalajeIndividual { get; set; } // Peso del empaque individual
        public decimal PesoTotalIndividual => PesoProducto + PesoEmbalajeIndividual;

        // Etiquetado
        public string CodigoQREmbalajeAcondicionado { get; set; } // QR del producto empacado
        public string NumeroLote { get; set; }
        public DateTime FechaExpiracion { get; set; }

        // Estado
        public EstadoProductoAcondicionado Estado { get; set; } = EstadoProductoAcondicionado.EnAcondicionamiento;

        // Temperatura
        public decimal TemperaturaActual { get; set; }
        public bool RequiereRefrigeración { get; set; } = true;

        // Información de empaque
        public TipoEmbalaje TipoEmbalaje { get; set; }
        public string DescripcionEmbalajeEspecifico { get; set; }

        // Control de calidad
        public bool AprobadoControlCalidad { get; set; } = true;
        public string MotivosRechazo { get; set; }

        // Auditoría
        public DateTime FechaAcondicionamiento { get; set; } = DateTime.Now;
        public Guid? AcondicionadoPor { get; set; }
        public DateTime? FechaListoParaDespacho { get; set; }
        public string Observaciones { get; set; }
    }

    public enum EstadoProductoAcondicionado
    {
        EnAcondicionamiento = 0,
        Acondicionado = 1,
        AprobadoCC = 2, // Control de calidad
        Rechazado = 3,
        ListoParaDespacho = 4,
        Despachado = 5
    }
}
