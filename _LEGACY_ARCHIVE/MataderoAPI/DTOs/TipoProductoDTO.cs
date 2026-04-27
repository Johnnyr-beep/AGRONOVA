using System;
using MataderoAPI.Models;

namespace MataderoAPI.DTOs
{
    public class TipoProductoDTO
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Codigo { get; set; }
        public string Clasificacion { get; set; }
        public decimal PrecioBaseKg { get; set; }
        public decimal PesoMinimo { get; set; }
        public decimal PesoMaximo { get; set; }
        public bool RequiereControlCalidad { get; set; }
        public decimal TemperaturaOptima { get; set; }
        public int DiasVidaUtil { get; set; }
        public bool Activo { get; set; }
    }

    public class CrearTipoProductoDTO
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Codigo { get; set; }
        public ClasificacionProducto Clasificacion { get; set; }
        public decimal PrecioBaseKg { get; set; }
        public decimal PesoMinimo { get; set; }
        public decimal PesoMaximo { get; set; }
        public bool RequiereControlCalidad { get; set; } = true;
        public decimal TemperaturaOptima { get; set; } = 4;
        public int DiasVidaUtil { get; set; } = 7;
    }

    public class ActualizarTipoProductoDTO
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal PrecioBaseKg { get; set; }
        public decimal PesoMinimo { get; set; }
        public decimal PesoMaximo { get; set; }
        public int DiasVidaUtil { get; set; }
        public bool Activo { get; set; }
    }
}
