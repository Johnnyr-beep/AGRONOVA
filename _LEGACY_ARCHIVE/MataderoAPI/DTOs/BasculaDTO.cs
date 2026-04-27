using System;
using System.Collections.Generic;

namespace MataderoAPI.DTOs
{
    public class BasculaDTO
    {
        public Guid Id { get; set; }
        public string NumeroTicket { get; set; }
        public int NumeroBascula { get; set; }
        public string GuiaMovilizacion { get; set; }
        public string Referencia { get; set; }
        public string PatentaCamion { get; set; }
        public string Transportista { get; set; }
        public decimal PesoEntradaKg { get; set; }
        public decimal PesoSalidaKg { get; set; }
        public decimal PesoVacio { get; set; }
        public decimal PesoLleno { get; set; }
        public decimal PesoNeto { get; set; }
        public decimal PromedioKg { get; set; }
        public int CantidadAnimales { get; set; }
        public Guid? ProveedorId { get; set; }
        public string Procedencia { get; set; }
        public string ProveedorNombre { get; set; }
        public string ClienteNombre { get; set; }
        public DateTime FechaIngreso { get; set; }
        public DateTime? FechaSalida { get; set; }
        public string Operario { get; set; }
        public string Observaciones { get; set; }
    }

    public class CrearBasculaDTO
    {
        public string GuiaMovilizacion { get; set; }
        public string Referencia { get; set; }
        public string PatentaCamion { get; set; }
        public string Transportista { get; set; }
        public decimal PesoEntradaKg { get; set; }
        public decimal PesoSalidaKg { get; set; }
        public decimal PesoVacio { get; set; }
        public decimal PesoLleno { get; set; }
        public int CantidadAnimales { get; set; }
        public Guid? ProveedorId { get; set; }
        public string Procedencia { get; set; }
        public string ProveedorNombre { get; set; }
        public string ClienteNombre { get; set; }
        public string Observaciones { get; set; }
    }

    public class ActualizarBasculaDTO
    {
        public string GuiaMovilizacion { get; set; }
        public string Referencia { get; set; }
        public decimal PesoEntradaKg { get; set; }
        public decimal PesoSalidaKg { get; set; }
        public decimal PesoVacio { get; set; }
        public decimal PesoLleno { get; set; }
        public int CantidadAnimales { get; set; }
        public string ProveedorNombre { get; set; }
        public string ClienteNombre { get; set; }
        public string Observaciones { get; set; }
        public DateTime? FechaSalida { get; set; }
    }
}
