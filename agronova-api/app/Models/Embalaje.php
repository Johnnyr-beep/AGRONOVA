<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Embalaje extends Model {
    use HasUuids;
    protected $table = 'Embalajes';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['NumeroEmbalaje','FechaEmbalaje','TipoProductoId','ProductoDesposteId','PesoNeto','PesoBruto','PesoTara','CantidadUnidades','TemperaturaProducto','Lote','FechaVencimiento','CodigoBarras','Estado','OperarioId','Observaciones','Eliminado'];
    protected $casts = ['Eliminado'=>'boolean'];
}
