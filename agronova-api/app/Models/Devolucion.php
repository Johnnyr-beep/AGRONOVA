<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Devolucion extends Model {
    use HasUuids;
    protected $table = 'Devoluciones';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['NumeroDevolucion','FechaDevolucion','DespachoId','ClienteId','MotivoDevolucion','PesoDevueltoKg','MontoDevolucion','Estado','AprobadoPorId','FechaAprobacion','Observaciones','CreadoPor','Eliminado'];
    protected $casts = ['Eliminado'=>'boolean'];
}
