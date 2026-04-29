<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductoDesposte extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ProductosDesposte';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'DesposteId',
        'TipoProductoId',
        'NumeroProducto',
        'PesoKg',
        'Lote',
        'Destino',
        'Estado',
        'FechaGeneracion',
        'CodigoLote',
        'TemperaturaAlmacenamiento',
        'FechaLimiteProcesamiento',
        'DespachoId',
        'CreadoPor',
        'Observaciones',
    ];

    protected $casts = [
        'PesoKg' => 'decimal:2',
        'FechaGeneracion' => 'datetime',
        'TemperaturaAlmacenamiento' => 'decimal:2',
        'FechaLimiteProcesamiento' => 'datetime',
    ];

    public function desposte()
    {
        return $this->belongsTo(Desposte::class, 'DesposteId');
    }

    public function tipoProducto()
    {
        return $this->belongsTo(TipoProducto::class, 'TipoProductoId');
    }

    public function despacho()
    {
        return $this->belongsTo(Despacho::class, 'DespachoId');
    }
}
