<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Movimiento extends Model {
    use HasUuids;
    protected $table = 'Movimientos';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['Tipo','InsumoId','Cantidad','StockAnterior','StockResultante','FechaMovimiento','Referencia','Motivo','OperarioId'];

    public function insumo()
    {
        return $this->belongsTo(Insumo::class, 'InsumoId', 'Id');
    }
}
