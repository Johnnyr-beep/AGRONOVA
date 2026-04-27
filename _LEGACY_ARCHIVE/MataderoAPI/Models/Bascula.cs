using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Registro de báscula camionera, primer punto de ingreso
    /// </summary>
    public class Bascula
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // Identificación
        public string NumeroTicket { get; set; } // Ticket único de báscula
        public int NumeroBascula { get; set; } // Número físico de la báscula

        // Documento de movilización / referencia operativa
        public string GuiaMovilizacion { get; set; }
        public string Referencia { get; set; }
        
        // Información del vehículo
        public string PatentaCamion { get; set; }
        public string Transportista { get; set; }
        
        // Pesos
        // Pesos capturados tal cual en pantalla (entrada/salida)
        public decimal PesoEntradaKg { get; set; }
        public decimal PesoSalidaKg { get; set; }

        // Pesos normalizados (mínimo/máximo) para compatibilidad con procesos existentes
        public decimal PesoVacío { get; set; }
        public decimal PesoLleno { get; set; }
        public decimal PesoNeto => PesoLleno - PesoVacío;
        public int CantidadAnimales { get; set; }
        
        // Información de proveedores/ganadería
        public Guid? ProveedorId { get; set; }
        public virtual Proveedor Proveedor { get; set; }
        public string Procedencia { get; set; } // Localidad, región
        public string ProveedorNombre { get; set; }
        public string ClienteNombre { get; set; }
        
        // Fechas
        public DateTime FechaIngreso { get; set; } = DateTime.Now;
        public DateTime? FechaSalida { get; set; }
        
        // Personal
        public Guid? OperarioId { get; set; }
        public virtual Usuario Operario { get; set; }
        
        // Observaciones
        public string Observaciones { get; set; }
        
        // Relación con canales generadas
        public virtual ICollection<Canal> Canales { get; set; } = new List<Canal>();

        // Relación con faenas
        public virtual ICollection<Faena> Faenas { get; set; } = new List<Faena>();
        
        // Auditoría
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public bool Eliminado { get; set; } = false;
    }
}
