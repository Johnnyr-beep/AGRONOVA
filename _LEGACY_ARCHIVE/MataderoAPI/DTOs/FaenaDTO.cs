using MataderoAPI.Models;

namespace MataderoAPI.DTOs
{
    public class FaenaDTO
    {
        public Guid Id { get; set; }
        public string NumeroFaena { get; set; }
        public string NumeroCanal { get; set; }
        public EstadoFaena Estado { get; set; }
        public DateTime HoraInicio { get; set; }
        public DateTime? HoraFin { get; set; }
        public int? TiempoProcesoMinutos { get; set; }
        public decimal PesoEntrada { get; set; }
        public decimal PesoCanal { get; set; }
        public TipoAnimal TipoAnimal { get; set; }
        public string NumeroIdentificacion { get; set; }
        public EstadoSanitario EstadoSanitario { get; set; }
        public bool AprobadoInspeccionAnte { get; set; }
        public bool AprobadoInspeccionPost { get; set; }
        public bool InspeccionPostMortem { get; set; }
        public DateTime FechaCreacion { get; set; }
    }

    public class CrearFaenaDTO
    {
        public Guid CanalId { get; set; }
        public Guid BasculaId { get; set; }
        public string NumeroCanal { get; set; }
        public string NumeroIdentificacion { get; set; }
        public TipoAnimal TipoAnimal { get; set; }
        public decimal PesoEntrada { get; set; }
        public EstadoSanitario EstadoSanitario { get; set; }
        public DateTime HoraInicio { get; set; }
    }

    public class ActualizarFaenaDTO
    {
        public EstadoFaena? Estado { get; set; }
        public MetodoInsensibilizacion? MetodoInsensibilizacion { get; set; }
        public DateTime? HoraInsensibilizacion { get; set; }
        public MetodoDesangre? MetodoDesangre { get; set; }
        public DateTime? HoraDesangre { get; set; }
        public decimal? VolumenSangreRecolectado { get; set; }
        public bool? Pelado { get; set; }
        public DateTime? HoraPelado { get; set; }
        public bool? Eviscerado { get; set; }
        public DateTime? HoraEviscerado { get; set; }
        public bool? DivisionMedialsterna { get; set; }
        public DateTime? HoraDivision { get; set; }
        public decimal? PesoCanal { get; set; }
    }

    public class InspeccionVeterinarioFaenaDTO
    {
        public Guid FaenaId { get; set; }
        public TipoInspeccion TipoInspeccion { get; set; }
        public string Observaciones { get; set; }
        public bool Aprobado { get; set; }
        public string RazonRechazo { get; set; }
    }

    public class ControlBienestarAnimalDTO
    {
        public Guid FaenaId { get; set; }
        public string Criterio { get; set; }
        public bool Cumplido { get; set; }
        public string Observaciones { get; set; }
    }

    public class FaenaReporteDTO
    {
        public string NumeroFaena { get; set; }
        public string NumeroCanal { get; set; }
        public TipoAnimal TipoAnimal { get; set; }
        public EstadoFaena Estado { get; set; }
        public decimal PesoEntrada { get; set; }
        public decimal PesoCanal { get; set; }
        public decimal Rendimiento { get; set; }
        public int TiempoProcesoMinutos { get; set; }
        public bool AprobadoVeterinario { get; set; }
        public int CantidadInspecciones { get; set; }
        public DateTime FechaFaena { get; set; }
    }

    public class InspeccionVeterinarioDTO
    {
        public Guid Id { get; set; }
        public Guid FaenaId { get; set; }
        public TipoInspeccion TipoInspeccion { get; set; }
        public DateTime FechaInspeccion { get; set; }
        public string Observaciones { get; set; }
        public bool Aprobado { get; set; }
        public string RazonRechazo { get; set; }
    }

    public class ControlBienestarDTO
    {
        public Guid Id { get; set; }
        public Guid FaenaId { get; set; }
        public string Criterio { get; set; }
        public bool Cumplido { get; set; }
        public string Observaciones { get; set; }
        public DateTime FechaControl { get; set; }
    }
}
