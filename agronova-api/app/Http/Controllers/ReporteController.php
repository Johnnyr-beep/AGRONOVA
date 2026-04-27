<?php

namespace App\Http\Controllers;

use App\Models\Faena;
use App\Models\Desposte;
use App\Models\Despacho;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    public function dashboardStats()
    {
        $hoy = now()->startOfDay();
        
        return response()->json([
            'faenas_hoy' => Faena::where('HoraInicio', '>=', $hoy)->count(),
            'despachos_hoy' => Despacho::where('FechaDespacho', '>=', $hoy)->count(),
            'total_kilos_hoy' => Faena::where('HoraInicio', '>=', $hoy)->sum('PesoEntrada'),
            'mermas_promedio' => Desposte::avg('PerdidaProcesoKg') ?? 0,
        ]);
    }

    public function faenaReport(Request $request)
    {
        $query = Faena::with(['canal', 'bascula', 'veterinarioInspector']);

        if ($request->fecha_inicio) {
            $query->where('HoraInicio', '>=', $request->fecha_inicio);
        }
        if ($request->fecha_fin) {
            $query->where('HoraInicio', '<=', $request->fecha_fin);
        }

        return $query->get();
    }

    public function desposteReport(Request $request)
    {
        $query = Desposte::with(['canal', 'operario', 'productosDesposte']);

        if ($request->fecha_inicio) {
            $query->where('FechaDesposte', '>=', $request->fecha_inicio);
        }

        return $query->get();
    }
}
