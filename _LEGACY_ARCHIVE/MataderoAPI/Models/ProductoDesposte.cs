using System;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Productos individuales generados durante el desposte de una canal
    /// </summary>
    public class ProductoDesposte
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // Relación con Desposte
        public Guid DesposteId { get; set; }
        public virtual Desposte Desposte { get; set; }
        
        // Tipo de producto (Lomo, Costilla, Falda, Asado, Pecho, etc)
        public Guid TipoProductoId { get; set; }
        public virtual TipoProducto TipoProducto { get; set; }
        
        // Información del producto
        public string NumeroProducto { get; set; } // Identificador único para trazabilidad (Ej: PROD-0001-2026)
        public decimal PesoKg { get; set; }
        public string Lote { get; set; } // Lote de producción
        
        // Destino y estado
        public DestinoProducto Destino { get; set; } // Venta, Procesamiento Secundario, Rechazo
        public EstadoProductoDesposte Estado { get; set; } = EstadoProductoDesposte.Disponible;
        
        // Información de trazabilidad
        public DateTime FechaGeneracion { get; set; } = DateTime.Now;
        public string CodigoLote { get; set; } // QR/Barcode para trazabilidad
        
        // Control de temperatura y preservación
        public decimal TemperaturaAlmacenamiento { get; set; } // En Celsius, debe estar < 4°C
        public DateTime FechaLimiteProcesamiento { get; set; } // Fecha máxima para procesar antes de descartar
        
        // Información de despacho
        public Guid? DespachoId { get; set; }
        public virtual Despacho Despacho { get; set; }
        
        // Auditoría
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public Guid? CreadoPor { get; set; }
        public string Observaciones { get; set; }
    }

    public enum DestinoProducto
    {
        Venta = 0,
        ProcesamientoSecundario = 1,
        Rechazo = 2,
        Devolucion = 3
    }

    public enum EstadoProductoDesposte
    {
        Disponible = 0,
        EnTransito = 1,
        Despachado = 2,
        Rechazado = 3,
        Extraviado = 4
    }
}
