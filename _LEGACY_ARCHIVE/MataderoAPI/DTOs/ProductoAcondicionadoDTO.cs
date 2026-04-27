using System;
using MataderoAPI.Models;

namespace MataderoAPI.DTOs
{
    public class ProductoAcondicionadoDTO
    {
        public Guid Id { get; set; }
        public Guid AcondicionamientoId { get; set; }
        public Guid ProductoDesposteId { get; set; }
        public string NumeroProductoAcondicionado { get; set; }
        public decimal PesoProducto { get; set; }
        public decimal PesoEmbalajeIndividual { get; set; }
        public decimal PesoTotalIndividual { get; set; }

        public string CodigoQREmbalajeAcondicionado { get; set; }
        public string NumeroLote { get; set; }
        public DateTime FechaExpiracion { get; set; }

        public EstadoProductoAcondicionado Estado { get; set; }
        public decimal TemperaturaActual { get; set; }
        public bool RequiereRefrigeración { get; set; }

        public string TipoEmbalaje { get; set; }
        public string DescripcionEmbalajeEspecifico { get; set; }

        public bool AprobadoControlCalidad { get; set; }
        public string Observaciones { get; set; }
    }

    public class CrearProductoAcondicionadoDTO
    {
        public Guid AcondicionamientoId { get; set; }
        public Guid ProductoDesposteId { get; set; }
        public decimal PesoProducto { get; set; }
        public decimal PesoEmbalajeIndividual { get; set; }
        public TipoEmbalaje TipoEmbalaje { get; set; }
        public string DescripcionEmbalajeEspecifico { get; set; }
        public decimal TemperaturaActual { get; set; }
        public bool RequiereRefrigeración { get; set; } = true;
        public string Observaciones { get; set; }
    }

    public class ActualizarProductoAcondicionadoDTO
    {
        public Guid Id { get; set; }
        public EstadoProductoAcondicionado Estado { get; set; }
        public decimal TemperaturaActual { get; set; }
        public bool AprobadoControlCalidad { get; set; }
        public string MotivosRechazo { get; set; }
        public string Observaciones { get; set; }
    }

    public class ControlCalidadAcondicionamientoDTO
    {
        public Guid Id { get; set; }
        public Guid AcondicionamientoId { get; set; }
        public bool ProductosIntactos { get; set; }
        public bool EmbalajeAdecuado { get; set; }
        public bool EtiquetasLegibles { get; set; }
        public bool TemperaturaOK { get; set; }
        public bool DocumentacionCompleta { get; set; }
        public bool CodigosQRVerificados { get; set; }
        public bool Aprobado { get; set; }
        public string MotivosRechazo { get; set; }
        public string Inspector { get; set; }
        public DateTime FechaInspección { get; set; }
        public string Observaciones { get; set; }
    }

    public class RealizarControlCalidadDTO
    {
        public Guid AcondicionamientoId { get; set; }
        public bool ProductosIntactos { get; set; } = true;
        public bool EmbalajeAdecuado { get; set; } = true;
        public bool EtiquetasLegibles { get; set; } = true;
        public bool TemperaturaOK { get; set; } = true;
        public bool DocumentacionCompleta { get; set; } = true;
        public bool CodigosQRVerificados { get; set; } = true;
        public bool Aprobado { get; set; } = true;
        public string MotivosRechazo { get; set; }
        public Guid? InspectorId { get; set; }
        public string Observaciones { get; set; }
    }
}
