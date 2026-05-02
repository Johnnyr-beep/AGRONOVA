<?php
namespace App\Http\Controllers;

use App\Models\Auditoria;
use Illuminate\Http\Request;

class AuditoriaController extends Controller
{
    public function index(Request $request)
    {
        $query = Auditoria::orderBy('FechaHora', 'desc');

        if ($request->input('modulo')) {
            $query->where('Modulo', $request->input('modulo'));
        }

        if ($request->input('accion')) {
            $query->where('Accion', $request->input('accion'));
        }

        if ($request->input('usuarioId')) {
            $query->where('UsuarioId', $request->input('usuarioId'));
        }

        return response()->json($query->paginate(100));
    }

    public function show($id)
    {
        $auditoria = Auditoria::findOrFail($id);
        return response()->json($auditoria);
    }
}
