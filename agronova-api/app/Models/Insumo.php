<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Insumo extends Model {
    use HasUuids;
    protected $table = 'Insumos';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['Nombre','Codigo','Descripcion','UnidadMedida','StockActual','StockMinimo','PrecioUnitario','ProveedorNombre','Activo','Eliminado'];
    protected $casts = ['Activo'=>'boolean','Eliminado'=>'boolean','StockActual'=>'decimal:3','StockMinimo'=>'decimal:3'];
}
