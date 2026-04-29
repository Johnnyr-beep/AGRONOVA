<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Permiso extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'Permisos';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'Nombre',
        'Descripcion',
        'Modulo',
        'Accion',
        'Activo',
    ];

    protected $casts = [
        'Activo' => 'boolean',
    ];

    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'RolPermisos', 'PermisoId', 'RolId');
    }
}
