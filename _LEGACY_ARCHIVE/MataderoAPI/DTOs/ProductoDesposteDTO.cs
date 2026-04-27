using System;
using MataderoAPI.Models;

namespace MataderoAPI.DTOs
{
    public class ProductoDesposteDTO
    {
        public Guid Id { get; set; }
        public Guid DesposteId { get; set; }
        public Guid TipoProductoId { get; set; }
        public string TipoProductoNombre { get; set; }
        
        public string NumeroProducto { get; set; }
        public decimal PesoKg { get; set; }
        public string Lote { get; set; }
        
        public DestinoProducto Destino { get; set; }
        public EstadoProductoDesposte Estado { get; set; }
        
        public DateTime FechaGeneracion { get; set; }
        public string CodigoLote { get; set; }
        
        public decimal TemperaturaAlmacenamiento { get; set; }
        public DateTime FechaLimiteProcesamiento { get; set; }
        public string Observaciones { get; set; }
    }

    public class CrearProductoDesposteDTO
    {
        public Guid DesposteId { get; set; }
        public Guid TipoProductoId { get; set; }
        public decimal PesoKg { get; set; }
        public string Lote { get; set; }
        public DestinoProducto Destino { get; set; }
        public decimal TemperaturaAlmacenamiento { get; set; }
        public string Observaciones { get; set; }
    }

    public class ActualizarProductoDesposteDTO
    {
        public Guid Id { get; set; }
        public EstadoProductoDesposte Estado { get; set; }
        public DestinoProducto Destino { get; set; }
        public decimal TemperaturaAlmacenamiento { get; set; }
        public string Observaciones { get; set; }
    }
}
