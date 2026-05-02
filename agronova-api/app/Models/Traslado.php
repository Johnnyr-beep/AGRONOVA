<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Traslado extends Model {
    use HasUuids;
    protected $table = 'Traslados';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['NumeroTraslado','FechaTraslado','CanalId','CavaOrigenId','CavaDestinoId','Origen','Destino','Estado','Observaciones','OperarioId','Eliminado'];
    protected $casts = ['Eliminado'=>'boolean'];
}
