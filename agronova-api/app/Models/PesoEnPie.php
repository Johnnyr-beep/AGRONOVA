<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PesoEnPie extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'PesosEnPie';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'Consecutivo',
        'Fecha',
        'GuiaMovilizacion',
        'ProveedorNombre',
        'ClienteNombre',
        'TipoAnimal',
        'UbicacionCorral',
        'PesoKg',
        'Observaciones',
        'Estado',
        'Eliminado',
    ];

    protected $casts = [
        'Fecha' => 'date',
        'PesoKg' => 'decimal:2',
        'Eliminado' => 'boolean',
    ];
}
