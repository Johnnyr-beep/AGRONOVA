using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    /// <summary>
    /// Módulo de Acondicionamiento - Empaque y preparación de productos para despacho
    /// </summary>
    public class Acondicionamiento
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Identificación
        public string NumeroAcondicionamiento { get; set; } // Ej: ACOND-001-2026
        public DateTime FechaAcondicionamiento { get; set; } = DateTime.Now;

        // Relación con Desposte
        public Guid DesposteId { get; set; }
        public virtual Desposte Desposte { get; set; }

        // Estado del acondicionamiento
        public EstadoAcondicionamiento Estado { get; set; } = EstadoAcondicionamiento.Pendiente;

        // Personal responsable
        public Guid? OperarioId { get; set; }
        public virtual Usuario Operario { get; set; }

        // Jefe de control de calidad que aprueba
        public Guid? AprobadoPorId { get; set; }
        public virtual Usuario AprobadoPor { get; set; }

        // Datos del acondicionamiento
        public DateTime HoraInicio { get; set; } = DateTime.Now;
        public DateTime? HoraFin { get; set; }
        public decimal TiempoProcesoMinutos => HoraFin.HasValue ? (decimal)(HoraFin.Value - HoraInicio).TotalMinutes : 0;

        // Información de embalaje
        public int CantidadProductosAcondicionados { get; set; }
        public decimal PesoTotalAcondicionado { get; set; } // Peso de productos
        public decimal PesoEmbalajeKg { get; set; } // Peso de los materiales de embalaje
        public decimal PesoTotalConEmbalaje => PesoTotalAcondicionado + PesoEmbalajeKg;

        // Tipo de embalaje utilizado
        public TipoEmbalaje TipoEmbalaje { get; set; }
        public string DescripcionEmbalaje { get; set; } // Detalles específicos del embalaje

        // Control de temperatura
        public decimal TemperaturaProductos { get; set; } // Temperatura a la que llegan
        public bool RequiereRefrigeracionEspecial { get; set; } = false;
        public string TipoRefrigerante { get; set; } // Hielo, Nitrogeno líquido, etc.

        // Etiquetado y documentación
        public bool EtiquetadoCompleto { get; set; } = false;
        public bool CodigosQRAsignados { get; set; } = false;
        public string NumeroLoteGlobal { get; set; } // Lote general del acondicionamiento
        public int CantidadEtiquetas { get; set; }

        // Control de calidad en acondicionamiento
        public ControlCalidadAcondicionamiento ControlCalidad { get; set; }

        // Productos acondicionados
        public virtual ICollection<ProductoAcondicionado> ProductosAcondicionados { get; set; } = new List<ProductoAcondicionado>();

        // Observaciones y notas
        public string Observaciones { get; set; }
        public bool AprobadoControlCalidad { get; set; } = false;
        public DateTime? FechaAprobacion { get; set; }

        // Auditoría
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public Guid? CreadoPor { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public Guid? ModificadoPor { get; set; }
        public bool Eliminado { get; set; } = false;
    }

    public enum EstadoAcondicionamiento
    {
        Pendiente = 0,
        EnProceso = 1,
        Completado = 2,
        AprobadoCC = 3, // Aprobado por control de calidad
        Rechazado = 4,
        Cancelado = 5
    }

    public enum TipoEmbalaje
    {
        Caja = 0,
        Bandeja = 1,
        VacioAlVacio = 2, // Empaque al vacío
        ConHielo = 3,
        ConNitrogeno = 4,
        ConGel = 5,
        Otro = 6
    }

    public class ControlCalidadAcondicionamiento
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid AcondicionamientoId { get; set; }
        public virtual Acondicionamiento Acondicionamiento { get; set; }

        // Inspección visual
        public bool ProductosIntactos { get; set; } = true;
        public bool EmbalajeAdecuado { get; set; } = true;
        public bool EtiquetasLegibles { get; set; } = true;

        // Temperatura
        public bool TemperaturaOK { get; set; } = true;
        public decimal TemperaturaMinima { get; set; } // Debe ser >= que esto
        public decimal TemperaturaMaxima { get; set; } // Debe ser < que esto

        // Documentación
        public bool DocumentacionCompleta { get; set; } = true;
        public bool CodigosQRVerificados { get; set; } = true;

        // Resultado
        public bool Aprobado { get; set; } = true;
        public string MotivosRechazo { get; set; }

        // Inspector
        public Guid? InspectorId { get; set; }
        public virtual Usuario Inspector { get; set; }

        public DateTime FechaInspección { get; set; } = DateTime.Now;
        public string Observaciones { get; set; }
    }
}
