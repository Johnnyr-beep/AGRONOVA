<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Bascula extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Basculas';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'NumeroTicket',
        'NumeroBascula',
        'GuiaMovilizacion',
        'Referencia',
        'PatentaCamion',
        'Transportista',
        'PesoEntradaKg',
        'PesoSalidaKg',
        'PesoVacio',
        'PesoLleno',
        'CantidadAnimales',
        'ProveedorId',
        'Procedencia',
        'ProveedorNombre',
        'ClienteNombre',
        'FechaIngreso',
        'FechaSalida',
        'OperarioId',
        'Observaciones',
        'Eliminado',
    ];

    protected $casts = [
        'PesoEntradaKg' => 'decimal:2',
        'PesoSalidaKg' => 'decimal:2',
        'PesoVacio' => 'decimal:2',
        'PesoLleno' => 'decimal:2',
        'FechaIngreso' => 'datetime',
        'FechaSalida' => 'datetime',
        'Eliminado' => 'boolean',
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'ProveedorId');
    }

    public function operario()
    {
        return $this->belongsTo(User::class, 'OperarioId');
    }

    public function canales()
    {
        return $this->hasMany(Canal::class, 'BasiculaId'); // Note: .NET uses 'BasiculaId' with a typo in some places, checking MataderoContext.cs
    }

    public function faenas()
    {
        return $this->hasMany(Faena::class, 'BasculaId');
    }
}
