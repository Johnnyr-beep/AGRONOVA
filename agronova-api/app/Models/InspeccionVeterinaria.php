<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class InspeccionVeterinaria extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'InspeccionesVeterinarias';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'FaenaId',
        'TipoInspeccion',
        'FechaInspeccion',
        'VeterinarioId',
        'Observaciones',
        'Aprobado',
        'RazonRechazo',
        'CreadoPor',
    ];

    protected $casts = [
        'FechaInspeccion' => 'datetime',
        'Aprobado' => 'boolean',
    ];

    public function faena()
    {
        return $this->belongsTo(Faena::class, 'FaenaId');
    }

    public function veterinario()
    {
        return $this->belongsTo(User::class, 'VeterinarioId');
    }
}
