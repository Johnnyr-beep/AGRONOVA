<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    use HasUuids;

    protected $table = 'Vehiculos';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'Placa', 'Marca', 'Modelo', 'Tipo',
        'CapacidadKg', 'ConductorId', 'Activo', 'Eliminado',
    ];

    protected $casts = ['Activo' => 'boolean', 'Eliminado' => 'boolean'];
}
