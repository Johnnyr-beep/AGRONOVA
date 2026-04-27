<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Rol extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Roles';

    protected $fillable = [
        'Nombre',
        'Descripcion',
        'Activo',
    ];

    protected $casts = [
        'Activo' => 'boolean',
    ];

    public function usuarios()
    {
        return $this->belongsToMany(User::class, 'UsuarioRoles', 'RolId', 'UsuarioId');
    }

    public function permisos()
    {
        return $this->belongsToMany(Permiso::class, 'RolPermisos', 'RolId', 'PermisoId');
    }
}
