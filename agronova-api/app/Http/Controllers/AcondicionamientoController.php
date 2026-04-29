<?php

namespace App\Http\Controllers;

use App\Models\Acondicionamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AcondicionamientoController extends Controller
{
    public function index()
    {
        return Acondicionamiento::where('Eliminado', false)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function show($id)
    {
        $acondicionamiento = Acondicionamiento::with([
            'desposte', 
            'operario', 
            'aprobadoPor', 
            'productosAcondicionados', 
            'controlCalidad'
        ])->findOrFail($id);
        
        return response()->json($acondicionamiento);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'DesposteId' => 'required|exists:Despostes,Id',
            'NumeroAcondicionamiento' => 'required|unique:Acondicionamientos',
            'OperarioId' => 'required|exists:Usuarios,Id',
        ]);

        $validated['Estado'] = 0; // Pendiente
        $validated['FechaAcondicionamiento'] = Carbon::now();
        $validated['HoraInicio'] = Carbon::now();
        $validated['CreadoPor'] = auth()->user()->Id;

        $acondicionamiento = Acondicionamiento::create($validated);

        return response()->json($acondicionamiento, 201);
    }

    public function update(Request $request, $id)
    {
        $acondicionamiento = Acondicionamiento::findOrFail($id);
        $validated = $request->validate([
            'Estado' => 'integer',
            'PesoTotalAcondicionado' => 'numeric',
            'TemperaturaProductos' => 'numeric',
            'EtiquetadoCompleto' => 'boolean',
            'AprobadoControlCalidad' => 'boolean',
        ]);

        if (isset($validated['Estado']) && $validated['Estado'] == 2) { // Completado
            $validated['HoraFin'] = Carbon::now();
        }

        $acondicionamiento->update($validated);

        return response()->json($acondicionamiento);
    }

    public function aprobar($id)
    {
        $acondicionamiento = Acondicionamiento::findOrFail($id);
        $acondicionamiento->update([
            'AprobadoControlCalidad' => true,
            'FechaAprobacion' => Carbon::now(),
            'AprobadoPorId' => auth()->user()->Id,
            'Estado' => 3, // Aprobado
        ]);

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $acondicionamiento = Acondicionamiento::findOrFail($id);
        $acondicionamiento->update(['Eliminado' => true]);

        return response()->json(null, 204);
    }
}
