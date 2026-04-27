using System;
using System.Collections.Generic;
using MataderoAPI.Models;

namespace MataderoAPI.DTOs
{
    public class AcondicionamientoDTO
    {
        public Guid Id { get; set; }
        public string NumeroAcondicionamiento { get; set; }
        public DateTime FechaAcondicionamiento { get; set; }
        public Guid DesposteId { get; set; }
        public EstadoAcondicionamiento Estado { get; set; }
        public string Operario { get; set; }

        public DateTime HoraInicio { get; set; }
        public DateTime? HoraFin { get; set; }
        public decimal TiempoProcesoMinutos { get; set; }

        public int CantidadProductosAcondicionados { get; set; }
        public decimal PesoTotalAcondicionado { get; set; }
        public decimal PesoEmbalajeKg { get; set; }
        public decimal PesoTotalConEmbalaje { get; set; }

        public string TipoEmbalaje { get; set; }
        public string DescripcionEmbalaje { get; set; }

        public decimal TemperaturaProductos { get; set; }
        public bool RequiereRefrigeracionEspecial { get; set; }
        public string TipoRefrigerante { get; set; }

        public bool EtiquetadoCompleto { get; set; }
        public bool CodigosQRAsignados { get; set; }
        public string NumeroLoteGlobal { get; set; }

        public List<ProductoAcondicionadoDTO> ProductosAcondicionados { get; set; } = new();
        public string Observaciones { get; set; }
        public bool AprobadoControlCalidad { get; set; }
    }

    public class CrearAcondicionamientoDTO
    {
        public Guid DesposteId { get; set; }
        public Guid? OperarioId { get; set; }
        public TipoEmbalaje TipoEmbalaje { get; set; }
        public string DescripcionEmbalaje { get; set; }
        public decimal TemperaturaProductos { get; set; }
        public bool RequiereRefrigeracionEspecial { get; set; } = false;
        public string TipoRefrigerante { get; set; }
        public string Observaciones { get; set; }
    }

    public class ActualizarAcondicionamientoDTO
    {
        public Guid Id { get; set; }
        public EstadoAcondicionamiento Estado { get; set; }
        public int CantidadProductosAcondicionados { get; set; }
        public decimal PesoTotalAcondicionado { get; set; }
        public decimal PesoEmbalajeKg { get; set; }
        public DateTime? HoraFin { get; set; }
        public bool EtiquetadoCompleto { get; set; }
        public bool CodigosQRAsignados { get; set; }
        public decimal TemperaturaProductos { get; set; }
        public string Observaciones { get; set; }
    }

    public class AprobarAcondicionamientoDTO
    {
        public Guid Id { get; set; }
        public bool Aprobado { get; set; } = true;
        public string MotivosRechazo { get; set; }
        public Guid? AprobadoPorId { get; set; }
    }
}
