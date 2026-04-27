using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Despacho de canales y productos finales
    /// </summary>
    public class Despacho
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // Identificación
        public string NumeroDespacho { get; set; } // ID único de despacho
        
        // Información del despacho
        public DateTime FechaDespacho { get; set; } = DateTime.Now;
        public EstadoDespacho Estado { get; set; } = EstadoDespacho.Pendiente;
        
        // Destino
        public Guid? ClienteId { get; set; }
        public virtual Cliente Cliente { get; set; }
        public string DireccionDestino { get; set; }
        
        // Información de transporte
        public string PatentaVehiculo { get; set; }
        public string TransportistaNombre { get; set; }
        public DateTime? FechaSalida { get; set; }
        public DateTime? FechaEntregaConfirmada { get; set; }
        
        // Datos del despacho
        public decimal PesoTotalKg { get; set; }
        public int CantidadProductos { get; set; }
        public decimal MontoTotal { get; set; }
        
        // Control de temperatura
        public decimal TemperaturaVehiculo { get; set; } // Debe estar < 4°C
        public string NumeroSelloRefrigeracion { get; set; }
        
        // Productos incluidos
        public virtual ICollection<ProductoDesposte> ProductosDesposte { get; set; } = new List<ProductoDesposte>();
        
        // Control de calidad en despacho
        public string ObservacionesDespacho { get; set; }
        public bool AprobadoDespacho { get; set; } = true;
        
        // Documentación
        public string NumeroGuiaTransporte { get; set; }
        public string NumeroFactura { get; set; }
        
        // Personal responsable
        public Guid? ResponsableDespachoId { get; set; }
        public virtual Usuario ResponsableDespacho { get; set; }
        
        // Auditoría
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public Guid? CreadoPor { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public Guid? ModificadoPor { get; set; }
        public bool Eliminado { get; set; } = false;
    }

    public enum EstadoDespacho
    {
        Pendiente = 0,
        Preparando = 1,
        Listo = 2,
        Despachado = 3,
        Entregado = 4,
        Cancelado = 5
    }
}
