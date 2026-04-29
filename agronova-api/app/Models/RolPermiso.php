<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RolPermiso extends Pivot
{
    use HasUuids;

    protected $table = 'RolPermisos';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'RolId',
        'PermisoId',
        'FechaAsignacion',
    ];

    protected $casts = [
        'FechaAsignacion' => 'datetime',
    ];
}
