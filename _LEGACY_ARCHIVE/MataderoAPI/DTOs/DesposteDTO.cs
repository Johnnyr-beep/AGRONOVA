using System;
using System.Collections.Generic;
using MataderoAPI.Models;

namespace MataderoAPI.DTOs
{
    public class DesposteDTO
    {
        public Guid Id { get; set; }
        public Guid CanalId { get; set; }
        public string NumeroDesposte { get; set; }
        public DateTime FechaDesposte { get; set; }
        public EstadoDesposte Estado { get; set; }
        public string Operario { get; set; }
        
        public decimal PesoCanalOriginal { get; set; }
        public decimal PesoTotalProductos { get; set; }
        public decimal PerdidaProcesoKg { get; set; }
        public decimal PorcentajeRendimiento { get; set; }
        
        public DateTime HoraInicio { get; set; }
        public DateTime? HoraFin { get; set; }
        public decimal TiempoProcesoMinutos { get; set; }
        
        public List<ProductoDesposteDTO> ProductosDesposte { get; set; } = new();
        public string ObservacionesCalidad { get; set; }
        public bool AptilizadoControlCalidad { get; set; }
    }

    public class CrearDesposteDTO
    {
        public Guid CanalId { get; set; }
        public Guid? OperarioId { get; set; }
        public string ObservacionesCalidad { get; set; }
    }

    public class ActualizarDesposteDTO
    {
        public Guid Id { get; set; }
        public EstadoDesposte Estado { get; set; }
        public decimal PesoTotalProductos { get; set; }
        public decimal PerdidaProcesoKg { get; set; }
        public DateTime? HoraFin { get; set; }
        public string ObservacionesCalidad { get; set; }
        public bool AptilizadoControlCalidad { get; set; }
    }
}
