<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Cava extends Model {
    use HasUuids;
    protected $table = 'Cavas';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['Nombre','Numero','CapacidadCanales','TemperaturaObjetivo','TemperaturaActual','Estado','Descripcion','Activo','Eliminado'];
    protected $casts = ['Activo'=>'boolean','Eliminado'=>'boolean'];
}
