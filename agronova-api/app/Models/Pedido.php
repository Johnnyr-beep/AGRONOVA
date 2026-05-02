<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasUuids;

    protected $table = 'Pedidos';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'NumeroPedido', 'FechaPedido', 'ClienteId', 'ClienteNombre',
        'PesoTotalKg', 'MontoTotal', 'Estado', 'Observaciones',
        'CreadoPor', 'Eliminado',
    ];

    protected $casts = ['Eliminado' => 'boolean'];
}
