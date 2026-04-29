<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ControlCalidadAcondicionamiento extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ControlCalidadesAcondicionamiento';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'AcondicionamientoId',
        'ProductosIntactos',
        'EmbalajeAdecuado',
        'EtiquetasLegibles',
        'TemperaturaOK',
        'TemperaturaMinima',
        'TemperaturaMaxima',
        'DocumentacionCompleta',
        'CodigosQRVerificados',
        'Aprobado',
        'MotivosRechazo',
        'InspectorId',
        'FechaInspección',
        'Observaciones',
    ];

    protected $casts = [
        'ProductosIntactos' => 'boolean',
        'EmbalajeAdecuado' => 'boolean',
        'EtiquetasLegibles' => 'boolean',
        'TemperaturaOK' => 'boolean',
        'TemperaturaMinima' => 'decimal:2',
        'TemperaturaMaxima' => 'decimal:2',
        'DocumentacionCompleta' => 'boolean',
        'CodigosQRVerificados' => 'boolean',
        'Aprobado' => 'boolean',
        'FechaInspección' => 'datetime',
    ];

    public function acondicionamiento()
    {
        return $this->belongsTo(Acondicionamiento::class, 'AcondicionamientoId');
    }

    public function inspector()
    {
        return $this->belongsTo(User::class, 'InspectorId');
    }
}
