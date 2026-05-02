<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Bodega extends Model
{
    use HasUuids;

    protected $table = 'Bodegas';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'Nombre', 'Codigo', 'Tipo', 'CavaId',
        'Capacidad', 'Estado', 'Activo', 'Eliminado',
    ];

    protected $casts = ['Activo' => 'boolean', 'Eliminado' => 'boolean'];
}
