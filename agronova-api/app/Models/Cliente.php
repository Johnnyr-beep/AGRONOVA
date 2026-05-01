<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Cliente extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Clientes';
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
        'Observaciones',
        'Eliminado',
    ];

    protected $casts = [
        'Activo' => 'boolean',
        'Eliminado' => 'boolean',
    ];

    public function despachos()
    {
        return $this->hasMany(Despacho::class, 'ClienteId');
    }
}
