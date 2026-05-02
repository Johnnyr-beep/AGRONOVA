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
        'DesposteId',
        'OperarioId',
        'AprobadoPorId',
        'FechaAcondicionamiento',
        'HoraInicio',
        'HoraFin',
        'TemperaturaProductos',
        'PesoTotalAcondicionado',
        'EtiquetadoCompleto',
        'AprobadoControlCalidad',
        'FechaAprobacion',
        'Estado',
        'CreadoPor',
        'Eliminado',
    ];

    protected $casts = [
        'FechaAcondicionamiento' => 'datetime',
        'HoraInicio' => 'datetime',
        'HoraFin' => 'datetime',
        'PesoTotalAcondicionado' => 'decimal:2',
        'TemperaturaProductos' => 'decimal:2',
        'EtiquetadoCompleto' => 'boolean',
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
