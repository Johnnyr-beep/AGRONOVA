<?php

namespace App\Http\Controllers;

use App\Models\Beneficio;
use App\Models\AnimalBeneficio;
use App\Models\Desposte;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    public function dashboardStats()
    {
        return response()->json([
            'beneficios_hoy'     => Beneficio::whereDate('Fecha', today())
                ->where('Eliminado', false)
                ->count(),
            'animales_hoy'       => AnimalBeneficio::whereHas(
                    'beneficio',
                    fn($q) => $q->whereDate('Fecha', today())
                )
                ->where('Eliminado', false)
                ->count(),
            'beneficios_abiertos' => Beneficio::where('Estado', 'Abierto')
                ->where('Eliminado', false)
                ->count(),
            'mermas_promedio'    => (float) (Desposte::avg('PerdidaProcesoKg') ?? 0),
        ]);
    }

    public function faenaReport(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'nullable|date',
            'fecha_fin'    => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        $query = Beneficio::with(['animales' => fn($q) => $q->where('Eliminado', false)])
            ->where('Eliminado', false);

        if ($request->input('fecha_inicio')) {
            $query->where('Fecha', '>=', $request->input('fecha_inicio'));
        }
        if ($request->input('fecha_fin')) {
            $query->where('Fecha', '<=', $request->input('fecha_fin'));
        }

        return response()->json($query->get());
    }

    public function desposteReport(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'nullable|date',
        ]);

        $query = Desposte::with(['canal', 'operario', 'productosDesposte']);

        if ($request->input('fecha_inicio')) {
            $query->where('FechaDesposte', '>=', $request->input('fecha_inicio'));
        }

        return response()->json($query->get());
    }
}
