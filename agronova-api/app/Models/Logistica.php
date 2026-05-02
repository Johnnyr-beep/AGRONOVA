<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Logistica extends Model
{
    use HasUuids;

    protected $table = 'Logistica';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'NumeroLogistica', 'FechaLogistica', 'DespachoId', 'VehiculoId',
        'VehiculoPlaca', 'ConductorId', 'ConductorNombre', 'Origen',
        'Destino', 'Estado', 'Observaciones', 'CreadoPor', 'Eliminado',
    ];

    protected $casts = ['Eliminado' => 'boolean'];
}
