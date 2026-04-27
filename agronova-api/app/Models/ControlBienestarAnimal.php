<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ControlBienestarAnimal extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ControlesBienestarAnimal';

    protected $fillable = [
        'FaenaId',
        'Criterio',
        'Cumplido',
        'Observaciones',
        'FechaControl',
        'ControladoPor',
    ];

    protected $casts = [
        'FechaControl' => 'datetime',
        'Cumplido' => 'boolean',
    ];

    public function faena()
    {
        return $this->belongsTo(Faena::class, 'FaenaId');
    }

    public function controlador()
    {
        return $this->belongsTo(User::class, 'ControladoPor');
    }
}
