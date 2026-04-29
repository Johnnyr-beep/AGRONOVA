<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Desposte extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Despostes';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'CanalId',
        'FechaDesposte',
        'NumeroDesposte',
        'Estado',
        'OperarioId',
        'PesoCanalOriginal',
        'HoraInicio',
        'HoraFin',
        'PesoTotalProductos',
        'PerdidaProcesoKg',
        'ObservacionesCalidad',
        'AptilizadoControlCalidad',
        'CreadoPor',
        'ModificadoPor',
        'Eliminado',
    ];

    protected $casts = [
        'FechaDesposte' => 'datetime',
        'HoraInicio' => 'datetime',
        'HoraFin' => 'datetime',
        'PesoCanalOriginal' => 'decimal:2',
        'PesoTotalProductos' => 'decimal:2',
        'PerdidaProcesoKg' => 'decimal:2',
        'AptilizadoControlCalidad' => 'boolean',
        'Eliminado' => 'boolean',
    ];

    public function canal()
    {
        return $this->belongsTo(Canal::class, 'CanalId');
    }

    public function operario()
    {
        return $this->belongsTo(User::class, 'OperarioId');
    }

    public function productosDesposte()
    {
        return $this->hasMany(ProductoDesposte::class, 'DesposteId');
    }

    public function acondicionamientos()
    {
        return $this->hasMany(Acondicionamiento::class, 'DesposteId');
    }
}
