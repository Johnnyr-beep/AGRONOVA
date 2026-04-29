<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Beneficio extends Model
{
    use HasUuids;

    protected $table = 'Beneficios';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'NumeroOrden',
        'Fecha',
        'ClienteNit',
        'ClienteNombre',
        'ModoImpresion',
        'Estado',
        'Eliminado',
    ];

    protected $casts = [
        'Fecha' => 'date',
        'Eliminado' => 'boolean',
    ];

    public function animales()
    {
        return $this->hasMany(AnimalBeneficio::class, 'BeneficioId');
    }
}
