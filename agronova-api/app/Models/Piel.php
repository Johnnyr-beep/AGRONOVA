<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Piel extends Model {
    use HasUuids;
    protected $table = 'Pieles';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['CanalId','FechaRegistro','PesoKg','Estado','Destino','PrecioKg','ValorTotal','Observaciones','Eliminado'];
    protected $casts = ['Eliminado'=>'boolean'];
}
