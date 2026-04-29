<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AnimalBeneficio extends Model
{
    use HasUuids;

    protected $table = 'AnimalesBeneficio';
    protected $primaryKey = 'Id';

    protected $fillable = [
        'BeneficioId',
        'Turno',
        'NumeroAnimal',
        'TipoAnimal',
        'PesoKg',
        'Estado',
        'ObservacionesCamionera',
        'Eliminado',
    ];

    protected $casts = [
        'PesoKg' => 'decimal:2',
        'Eliminado' => 'boolean',
    ];

    public function beneficio()
    {
        return $this->belongsTo(Beneficio::class, 'BeneficioId');
    }
}
