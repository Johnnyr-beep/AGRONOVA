<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Despacho extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Despachos';

    protected $fillable = [
        'NumeroDespacho',
        'FechaDespacho',
        'Estado',
        'ClienteId',
        'DireccionDestino',
        'PatentaVehiculo',
        'TransportistaNombre',
        'FechaSalida',
        'FechaEntregaConfirmada',
        'PesoTotalKg',
        'CantidadProductos',
        'MontoTotal',
        'TemperaturaVehiculo',
        'NumeroSelloRefrigeracion',
        'ObservacionesDespacho',
        'AprobadoDespacho',
        'NumeroGuiaTransporte',
        'NumeroFactura',
        'ResponsableDespachoId',
        'CreadoPor',
        'ModificadoPor',
        'Eliminado',
    ];

    protected $casts = [
        'FechaDespacho' => 'datetime',
        'FechaSalida' => 'datetime',
        'FechaEntregaConfirmada' => 'datetime',
        'PesoTotalKg' => 'decimal:2',
        'MontoTotal' => 'decimal:2',
        'TemperaturaVehiculo' => 'decimal:2',
        'AprobadoDespacho' => 'boolean',
        'Eliminado' => 'boolean',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'ClienteId');
    }

    public function responsable()
    {
        return $this->belongsTo(User::class, 'ResponsableDespachoId');
    }

    public function productosDesposte()
    {
        return $this->hasMany(ProductoDesposte::class, 'DespachoId');
    }
}
