<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Conservacion extends Model
{
    use HasUuids;

    protected $table = 'Conservacion';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'CavaId', 'CavaNombre', 'FechaRegistro', 'Temperatura',
        'Humedad', 'Estado', 'OperarioId', 'Observaciones', 'Eliminado',
    ];

    protected $casts = ['Eliminado' => 'boolean'];
}
