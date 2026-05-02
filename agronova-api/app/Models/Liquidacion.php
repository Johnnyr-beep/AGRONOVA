<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Liquidacion extends Model {
    use HasUuids;
    protected $table = 'Liquidaciones';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['NumeroLiquidacion','FechaLiquidacion','BeneficioId','ProveedorId','TotalAnimales','PesoTotalKg','PrecioKg','ValorBruto','Deducciones','ValorNeto','Estado','FechaPago','Observaciones','CreadoPor','Eliminado'];
    protected $casts = ['Eliminado'=>'boolean'];
}
