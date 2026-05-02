<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{
    use HasUuids;

    protected $table = 'Sedes';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'Nombre', 'ClienteId', 'ProveedorId', 'Direccion',
        'Ciudad', 'Telefono', 'Contacto', 'Activo', 'Eliminado',
    ];

    protected $casts = ['Activo' => 'boolean', 'Eliminado' => 'boolean'];
}
