<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Faena extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Faenas';

    protected $fillable = [
        'CanalId',
        'BasculaId',
        'NumeroFaena',
        'NumeroCanal',
        'Estado',
        'HoraInicio',
        'HoraFin',
        'TiempoProcesoMinutos',
        'VeterinarioInspectorId',
        'FechaInspeccionAnte',
        'AprobadoInspeccionAnte',
        'ComentariosInspeccionAnte',
        'TipoAnimal',
        'NumeroIdentificacion',
        'PesoEntrada',
        'PesoCanal',
        'EstadoSanitario',
        'MetodoInsensibilizacion',
        'HoraInsensibilizacion',
        'MetodoDesangre',
        'HoraDesangre',
        'VolumenSangreRecolectado',
        'Pelado',
        'HoraPelado',
        'Eviscerado',
        'HoraEviscerado',
        'DivisionMedialsterna',
        'HoraDivision',
        'AlcanzadoBienestarAnimal',
        'ObservacionesBienestar',
        'InspeccionPostMortem',
        'FechaInspeccionPost',
        'ResultadoInspeccionPost',
        'AprobadoInspeccionPost',
        'DestinoHígado',
        'DestinoRiñones',
        'DestinoCorazón',
        'DestinoLungares',
        'DestinoOtrosOrganos',
        'PesoHuesos',
        'PesoVísceras',
        'PesoSebo',
        'PesoCuero',
        'OperarioDesangrador',
        'OperarioEviscerador',
        'AprobadoPorId',
        'MovidoViaITTransporte',
        'HoraMovimiento',
        'LugarDestino',
        'CreadoPor',
        'ModificadoPor',
        'Eliminado',
    ];

    protected $casts = [
        'HoraInicio' => 'datetime',
        'HoraFin' => 'datetime',
        'FechaInspeccionAnte' => 'datetime',
        'HoraInsensibilizacion' => 'datetime',
        'HoraDesangre' => 'datetime',
        'HoraPelado' => 'datetime',
        'HoraEviscerado' => 'datetime',
        'HoraDivision' => 'datetime',
        'FechaInspeccionPost' => 'datetime',
        'HoraMovimiento' => 'datetime',
        'AprobadoInspeccionAnte' => 'boolean',
        'Pelado' => 'boolean',
        'Eviscerado' => 'boolean',
        'DivisionMedialsterna' => 'boolean',
        'AlcanzadoBienestarAnimal' => 'boolean',
        'InspeccionPostMortem' => 'boolean',
        'AprobadoInspeccionPost' => 'boolean',
        'MovidoViaITTransporte' => 'boolean',
        'Eliminado' => 'boolean',
        'PesoEntrada' => 'decimal:2',
        'PesoCanal' => 'decimal:2',
        'VolumenSangreRecolectado' => 'decimal:2',
        'PesoHuesos' => 'decimal:2',
        'PesoVísceras' => 'decimal:2',
        'PesoSebo' => 'decimal:2',
        'PesoCuero' => 'decimal:2',
    ];

    public function canal()
    {
        return $this->belongsTo(Canal::class, 'CanalId');
    }

    public function bascula()
    {
        return $this->belongsTo(Bascula::class, 'BasculaId');
    }

    public function veterinarioInspector()
    {
        return $this->belongsTo(User::class, 'VeterinarioInspectorId');
    }

    public function aprobadoPor()
    {
        return $this->belongsTo(User::class, 'AprobadoPorId');
    }

    public function inspeccionesVeterinarias()
    {
        return $this->hasMany(InspeccionVeterinaria::class, 'FaenaId');
    }

    public function controlesBienestar()
    {
        return $this->hasMany(ControlBienestarAnimal::class, 'FaenaId');
    }
}
