<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductoAcondicionado extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ProductosAcondicionados';

    protected $fillable = [
        'AcondicionamientoId',
        'ProductoDesposteId',
        'NumeroProductoAcondicionado',
        'PesoProducto',
        'PesoEmbalajeIndividual',
        'CodigoQREmbalajeAcondicionado',
        'NumeroLote',
        'FechaExpiracion',
        'Estado',
        'TemperaturaActual',
        'RequiereRefrigeración',
        'TipoEmbalaje',
        'DescripcionEmbalajeEspecifico',
        'AprobadoControlCalidad',
        'MotivosRechazo',
        'FechaAcondicionamiento',
        'AcondicionadoPor',
        'FechaListoParaDespacho',
        'Observaciones',
    ];

    protected $casts = [
        'PesoProducto' => 'decimal:2',
        'PesoEmbalajeIndividual' => 'decimal:2',
        'FechaExpiracion' => 'datetime',
        'TemperaturaActual' => 'decimal:2',
        'RequiereRefrigeración' => 'boolean',
        'AprobadoControlCalidad' => 'boolean',
        'FechaAcondicionamiento' => 'datetime',
        'FechaListoParaDespacho' => 'datetime',
    ];

    public function acondicionamiento()
    {
        return $this->belongsTo(Acondicionamiento::class, 'AcondicionamientoId');
    }

    public function productoDesposte()
    {
        return $this->belongsTo(ProductoDesposte::class, 'ProductoDesposteId');
    }

    public function acondicionadoPor()
    {
        return $this->belongsTo(User::class, 'AcondicionadoPor');
    }
}
