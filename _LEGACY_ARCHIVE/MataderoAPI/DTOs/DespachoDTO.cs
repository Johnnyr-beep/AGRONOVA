using System;
using System.Collections.Generic;
using MataderoAPI.Models;

namespace MataderoAPI.DTOs
{
    public class DespachoDTO
    {
        public Guid Id { get; set; }
        public string NumeroDespacho { get; set; }
        public DateTime FechaDespacho { get; set; }
        public EstadoDespacho Estado { get; set; }
        public string ClienteNombre { get; set; }
        public string DireccionDestino { get; set; }
        public string PatentaVehiculo { get; set; }
        public string TransportistaNombre { get; set; }
        public DateTime? FechaSalida { get; set; }
        public DateTime? FechaEntregaConfirmada { get; set; }
        public decimal PesoTotalKg { get; set; }
        public int CantidadProductos { get; set; }
        public decimal TemperaturaVehiculo { get; set; }
        public string NumeroSelloRefrigeracion { get; set; }
        public string NumeroGuiaTransporte { get; set; }
        public string NumeroFactura { get; set; }
        public string ObservacionesDespacho { get; set; }
        public bool AprobadoDespacho { get; set; }
    }

    public class CrearDespachoDTO
    {
        public Guid? ClienteId { get; set; }
        public string DireccionDestino { get; set; }
        public string PatentaVehiculo { get; set; }
        public string TransportistaNombre { get; set; }
        public decimal TemperaturaVehiculo { get; set; }
        public string NumeroSelloRefrigeracion { get; set; }
        public List<Guid> ProductosIds { get; set; } = new List<Guid>();
    }

    public class ActualizarDespachoDTO
    {
        public EstadoDespacho Estado { get; set; }
        public DateTime? FechaSalida { get; set; }
        public DateTime? FechaEntregaConfirmada { get; set; }
        public string NumeroGuiaTransporte { get; set; }
        public string NumeroFactura { get; set; }
        public string ObservacionesDespacho { get; set; }
        public bool AprobadoDespacho { get; set; }
    }
}
