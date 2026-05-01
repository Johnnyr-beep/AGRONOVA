<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TipoProducto extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'TiposProductos';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'Nombre',
        'Descripcion',
        'Codigo',
        'Clasificacion',
        'PrecioBaseKg',
        'PesoMinimo',
        'PesoMaximo',
        'RequiereControlCalidad',
        'TemperaturaOptima',
        'DiasVidaUtil',
        'Activo',
    ];

    protected $casts = [
        'PrecioBaseKg' => 'decimal:2',
        'PesoMinimo' => 'decimal:2',
        'PesoMaximo' => 'decimal:2',
        'TemperaturaOptima' => 'decimal:2',
        'RequiereControlCalidad' => 'boolean',
        'Activo' => 'boolean',
    ];

    public function productosDesposte()
    {
        return $this->hasMany(ProductoDesposte::class, 'TipoProductoId');
    }
}
