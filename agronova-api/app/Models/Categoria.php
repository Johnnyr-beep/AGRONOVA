<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasUuids;

    protected $table = 'Categorias';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'Nombre', 'Codigo', 'Descripcion', 'Activo', 'Eliminado',
    ];

    protected $casts = ['Activo' => 'boolean', 'Eliminado' => 'boolean'];
}
