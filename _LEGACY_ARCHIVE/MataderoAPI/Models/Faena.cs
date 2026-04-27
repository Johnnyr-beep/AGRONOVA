using System;
using System.Collections.Generic;

namespace MataderoAPI.Models
{
    public class Faena
    {
        public Guid Id { get; set; }
        public Guid CanalId { get; set; }
        public Guid? BasculaId { get; set; }
        public string NumeroFaena { get; set; }
        public string NumeroCanal { get; set; }

        // Estados del proceso
        public EstadoFaena Estado { get; set; }
        public DateTime HoraInicio { get; set; }
        public DateTime? HoraFin { get; set; }
        public int? TiempoProcesoMinutos { get; set; }

        // Inspección veterinaria
        public Guid? VeterinarioInspectorId { get; set; }
        public DateTime? FechaInspeccionAnte { get; set; }
        public bool AprobadoInspeccionAnte { get; set; }
        public string ComentariosInspeccionAnte { get; set; }

        // Datos del animal
        public TipoAnimal TipoAnimal { get; set; }
        public string NumeroIdentificacion { get; set; }
        public decimal PesoEntrada { get; set; }
        public decimal PesoCanal { get; set; }
        public EstadoSanitario EstadoSanitario { get; set; }

        // Procesos de faena
        public MetodoInsensibilizacion MetodoInsensibilizacion { get; set; }
        public DateTime? HoraInsensibilizacion { get; set; }

        public MetodoDesangre MetodoDesangre { get; set; }
        public DateTime? HoraDesangre { get; set; }
        public decimal? VolumenSangreRecolectado { get; set; }

        public bool Pelado { get; set; }
        public DateTime? HoraPelado { get; set; }

        public bool Eviscerado { get; set; }
        public DateTime? HoraEviscerado { get; set; }

        public bool DivisionMedialsterna { get; set; }
        public DateTime? HoraDivision { get; set; }

        // Control de bienestar animal
        public bool AlcanzadoBienestarAnimal { get; set; }
        public string ObservacionesBienestar { get; set; }

        // Inspección post-mortem
        public bool InspeccionPostMortem { get; set; }
        public DateTime? FechaInspeccionPost { get; set; }
        public string ResultadoInspeccionPost { get; set; }
        public bool AprobadoInspeccionPost { get; set; }

        // Destino de órganos y subproductos
        public DestinoOrganos DestinoHígado { get; set; }
        public DestinoOrganos DestinoRiñones { get; set; }
        public DestinoOrganos DestinoCorazón { get; set; }
        public DestinoOrganos DestinoLungares { get; set; }
        public string DestinoOtrosOrganos { get; set; }

        // Subproductos
        public decimal PesoHuesos { get; set; }
        public decimal PesoVísceras { get; set; }
        public decimal PesoSebo { get; set; }
        public decimal PesoCuero { get; set; }

        // Personal
        public Guid? OperarioDesangrador { get; set; }
        public Guid? OperarioEviscerador { get; set; }
        public Guid? AprobadoPorId { get; set; }

        // Control de movimiento
        public bool MovidoViaITTransporte { get; set; }
        public DateTime? HoraMovimiento { get; set; }
        public string LugarDestino { get; set; }

        // Auditoría
        public DateTime FechaCreacion { get; set; }
        public Guid CreadoPor { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public Guid? ModificadoPor { get; set; }
        public bool Eliminado { get; set; }

        // Relaciones
        public virtual Canal Canal { get; set; }
        public virtual Bascula Bascula { get; set; }
        public virtual Usuario VeterinarioInspector { get; set; }
        public virtual Usuario Operario1 { get; set; }
        public virtual Usuario Operario2 { get; set; }
        public virtual Usuario AprobadoPor { get; set; }
        public virtual ICollection<InspeccionVeterinaria> InspeccionesVeterinarias { get; set; }
        public virtual ICollection<ControlBienestarAnimal> ControlesBienestar { get; set; }
    }

    public class InspeccionVeterinaria
    {
        public Guid Id { get; set; }
        public Guid FaenaId { get; set; }
        public TipoInspeccion TipoInspeccion { get; set; }
        public DateTime FechaInspeccion { get; set; }
        public Guid VeterinarioId { get; set; }
        public string Observaciones { get; set; }
        public bool Aprobado { get; set; }
        public string RazonRechazo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public Guid CreadoPor { get; set; }

        public virtual Faena Faena { get; set; }
        public virtual Usuario Veterinario { get; set; }
    }

    public class ControlBienestarAnimal
    {
        public Guid Id { get; set; }
        public Guid FaenaId { get; set; }
        public string Criterio { get; set; }
        public bool Cumplido { get; set; }
        public string Observaciones { get; set; }
        public DateTime FechaControl { get; set; }
        public Guid ControladoPor { get; set; }

        public virtual Faena Faena { get; set; }
        public virtual Usuario ControladoPorNavigation { get; set; }
    }

    // Enums
    public enum EstadoFaena
    {
        Pendiente = 0,
        EnProgreso = 1,
        InsensibilizadoCompleto = 2,
        DesangradoCompleto = 3,
        PeladoCompleto = 4,
        EvisceradoCompleto = 5,
        DivisionCompleta = 6,
        InspeccionVeterinaria = 7,
        AprobadoVeterinario = 8,
        RechazadoVeterinario = 9,
        CanalListaParaDesposte = 10,
        Cancelado = 11
    }

    public enum EstadoSanitario
    {
        Sano = 0,
        Afectado = 1,
        Decomiso = 2,
        Condena = 3,
        Sospechoso = 4
    }

    public enum MetodoInsensibilizacion
    {
        PistolaCautivaOseo = 0,
        PistolaCautivaBarrera = 1,
        DesgarroElectrico = 2,
        GaseCO2 = 3,
        GaseArgon = 4,
        Otro = 5
    }

    public enum MetodoDesangre
    {
        IncisionDorsalVentral = 0,
        IncisionLateral = 1,
        IncisionCaudalAlDorsalCaudal = 2,
        Otro = 3
    }

    public enum DestinoOrganos
    {
        ConsumoHumano = 0,
        AlimentoAnimal = 1,
        Decomiso = 2,
        OtroUso = 3
    }

    public enum TipoInspeccion
    {
        AnteMortem = 0,
        PostMortem = 1,
        ControlIntermedio = 2
    }
}
