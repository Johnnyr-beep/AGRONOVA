<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Tarifa extends Model
{
    use HasUuids;

    protected $table = 'Tarifas';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'Nombre', 'TipoServicio', 'ValorBase', 'ValorPorKm', 'Activo', 'Eliminado',
    ];

    protected $casts = ['Activo' => 'boolean', 'Eliminado' => 'boolean'];
}
