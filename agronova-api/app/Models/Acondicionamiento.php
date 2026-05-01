<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Acondicionamiento extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Acondicionamientos';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'NumeroAcondicionamiento',
        'FechaAcondicionamiento',
        'DesposteId',
        'Estado',
        'OperarioId',
        'AprobadoPorId',
        'HoraInicio',
        'HoraFin',
        'CantidadProductosAcondicionados',
        'PesoTotalAcondicionado',
        'PesoEmbalajeKg',
        'TipoEmbalaje',
        'DescripcionEmbalaje',
        'TemperaturaProductos',
        'RequiereRefrigeracionEspecial',
        'TipoRefrigerante',
        'EtiquetadoCompleto',
        'CodigosQRAsignados',
        'NumeroLoteGlobal',
        'CantidadEtiquetas',
        'Observaciones',
        'AprobadoControlCalidad',
        'FechaAprobacion',
        'CreadoPor',
        'ModificadoPor',
        'Eliminado',
    ];

    protected $casts = [
        'FechaAcondicionamiento' => 'datetime',
        'HoraInicio' => 'datetime',
        'HoraFin' => 'datetime',
        'PesoTotalAcondicionado' => 'decimal:2',
        'PesoEmbalajeKg' => 'decimal:2',
        'TemperaturaProductos' => 'decimal:2',
        'RequiereRefrigeracionEspecial' => 'boolean',
        'EtiquetadoCompleto' => 'boolean',
        'CodigosQRAsignados' => 'boolean',
        'AprobadoControlCalidad' => 'boolean',
        'FechaAprobacion' => 'datetime',
        'Eliminado' => 'boolean',
    ];

    public function desposte()
    {
        return $this->belongsTo(Desposte::class, 'DesposteId');
    }

    public function operario()
    {
        return $this->belongsTo(User::class, 'OperarioId');
    }

    public function aprobadoPor()
    {
        return $this->belongsTo(User::class, 'AprobadoPorId');
    }

    public function controlCalidad()
    {
        return $this->hasOne(ControlCalidadAcondicionamiento::class, 'AcondicionamientoId');
    }

    public function productosAcondicionados()
    {
        return $this->hasMany(ProductoAcondicionado::class, 'AcondicionamientoId');
    }
}
