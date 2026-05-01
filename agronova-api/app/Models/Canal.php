<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Canal extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Canales';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'NumeroCanal',
        'NumeroOreja',
        'BasiculaId',
        'TipoAnimal',
        'PesoVivo',
        'PesoCanalCaliente',
        'PesoCanalFria',
        'FechaFaena',
        'FechaRefrigeracion',
        'Estado',
        'AptilizadoFaena',
        'ObservacionesFaena',
        'ProveedorId',
        'DesposteId',
        'FechaDesposte',
        'CodigoQR',
        'CreadoPor',
        'ModificadoPor',
        'Eliminado',
    ];

    protected $casts = [
        'PesoVivo' => 'decimal:2',
        'PesoCanalCaliente' => 'decimal:2',
        'PesoCanalFria' => 'decimal:2',
        'FechaFaena' => 'datetime',
        'FechaRefrigeracion' => 'datetime',
        'FechaDesposte' => 'datetime',
        'AptilizadoFaena' => 'boolean',
        'Eliminado' => 'boolean',
    ];

    public function bascula()
    {
        return $this->belongsTo(Bascula::class, 'BasiculaId');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'ProveedorId');
    }

    public function desposte()
    {
        return $this->belongsTo(Desposte::class, 'DesposteId');
    }

    public function productos()
    {
        return $this->hasMany(ProductoDesposte::class, 'CanalId');
    }
}
