<?php

namespace App\Http\Controllers;

use App\Models\Desposte;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DesposteController extends Controller
{
    public function index()
    {
        return Desposte::where('Eliminado', false)
            ->with(['canal', 'operario'])
            ->orderBy('FechaDesposte', 'desc')
            ->get();
    }

    public function show($id)
    {
        $desposte = Desposte::with(['canal', 'operario', 'productosDesposte', 'acondicionamientos'])
            ->findOrFail($id);
        
        return response()->json($desposte);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroDesposte'   => 'required|unique:Despostes',
            'CanalId'          => 'nullable|uuid',
            'OperarioId'       => 'nullable|uuid',
            'PesoCanalOriginal' => 'required|numeric',
        ]);

        $validated['Estado'] = 0;
        $validated['FechaDesposte'] = Carbon::now();
        $validated['HoraInicio'] = Carbon::now();
        $validated['CreadoPor'] = auth()->user()->getKey();

        $desposte = Desposte::create($validated);

        return response()->json($desposte, 201);
    }

    public function update(Request $request, $id)
    {
        $desposte = Desposte::findOrFail($id);
        $validated = $request->validate([
            'Estado' => 'integer',
            'PesoTotalProductos' => 'numeric',
            'PerdidaProcesoKg' => 'numeric',
            'ObservacionesCalidad' => 'string',
            'AptilizadoControlCalidad' => 'boolean',
        ]);

        if (isset($validated['Estado']) && $validated['Estado'] == 2) { // Completado
            $validated['HoraFin'] = Carbon::now();
        }

        $desposte->update($validated);

        return response()->json($desposte);
    }

    public function destroy($id)
    {
        $desposte = Desposte::findOrFail($id);
        $desposte->update(['Eliminado' => true]);

        return response()->json(null, 204);
    }

    public function report(Request $request)
    {
        $request->validate([
            'fechaInicio' => 'required|date',
            'fechaFin'    => 'required|date|after_or_equal:fechaInicio',
        ]);

        $despostes = Desposte::whereBetween('FechaDesposte', [
                $request->input('fechaInicio'),
                $request->input('fechaFin'),
            ])
            ->where('Eliminado', false)
            ->get();

        return response()->json([
            'totalDespostes'      => $despostes->count(),
            'pesoTotalProcesado'  => $despostes->sum('PesoCanalOriginal'),
            'pesoTotalProductos'  => $despostes->sum('PesoTotalProductos'),
            'totalMermas'         => $despostes->sum('PerdidaProcesoKg'),
            'promedioRendimiento' => $despostes->avg(function ($d) {
                $original = (float) $d->getAttribute('PesoCanalOriginal');
                $productos = (float) $d->getAttribute('PesoTotalProductos');
                return $original > 0 ? ($productos / $original) * 100 : 0;
            }),
        ]);
    }
}
