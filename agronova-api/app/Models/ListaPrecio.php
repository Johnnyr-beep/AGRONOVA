<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ListaPrecio extends Model
{
    use HasUuids;

    protected $table = 'ListaPrecios';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ClienteId', 'ClienteNombre', 'TipoProductoId', 'ProductoNombre',
        'PrecioKg', 'FechaVigencia', 'Estado', 'Observaciones', 'Eliminado',
    ];

    protected $casts = ['Eliminado' => 'boolean'];
}
