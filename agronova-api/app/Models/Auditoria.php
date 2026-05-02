<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Auditoria extends Model {
    use HasUuids;
    protected $table = 'Auditorias';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['UsuarioId','Accion','Modulo','RegistroId','DatosAntes','DatosDespues','IpAddress','FechaHora'];
    protected $casts = ['DatosAntes'=>'array','DatosDespues'=>'array'];
}
