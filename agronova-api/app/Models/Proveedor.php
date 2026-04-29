<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Proveedor extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Proveedores';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'Nombre',
        'RazonSocial',
        'RUT',
        'Telefono',
        'Email',
        'Direccion',
        'Ciudad',
        'Provincia',
        'CodigoPostal',
        'Activo',
        'Contacto',
        'Eliminado',
    ];

    protected $casts = [
        'Activo' => 'boolean',
        'Eliminado' => 'boolean',
    ];

    public function basculas()
    {
        return $this->hasMany(Bascula::class, 'ProveedorId');
    }

    public function canales()
    {
        return $this->hasMany(Canal::class, 'ProveedorId');
    }
}
