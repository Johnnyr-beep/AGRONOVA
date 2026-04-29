<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class UsuarioRol extends Pivot
{
    use HasUuids;

    protected $table = 'UsuarioRoles';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'UsuarioId',
        'RolId',
        'FechaAsignacion',
        'FechaExpiracion',
    ];

    protected $casts = [
        'FechaAsignacion' => 'datetime',
        'FechaExpiracion' => 'datetime',
    ];
}
