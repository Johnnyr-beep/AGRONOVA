<?php

namespace App\Http\Controllers;

use App\Models\Bascula;
use Illuminate\Http\Request;

class BasculaController extends Controller
{
    public function index()
    {
        return Bascula::where('Eliminado', false)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroTicket'     => 'required|unique:Basculas',
            'NumeroBascula'    => 'required|integer',
            'GuiaMovilizacion' => 'nullable|string|unique:Basculas',
            'Referencia'       => 'nullable|string',
            'Procedencia'      => 'nullable|string',
            'ProveedorNombre'  => 'nullable|string',
            'ClienteNombre'    => 'nullable|string',
            'PatentaCamion'    => 'required|string',
            'Conductor'        => 'nullable|string',
            'Transportista'    => 'nullable|string',
            'PesoLleno'        => 'required|numeric',
            'PesoVacio'        => 'required|numeric',
            'CantidadAnimales' => 'required|integer',
            'Observaciones'    => 'nullable|string',
            'ProveedorId'      => 'nullable|uuid',
        ]);

        if ($validated['PesoVacio'] >= $validated['PesoLleno']) {
            return response()->json([
                'message' => 'El peso de salida (vacío) debe ser menor al peso de entrada (lleno)'
            ], 422);
        }

        $bascula = Bascula::create($validated);

        return response()->json($bascula, 201);
    }

    public function show($id)
    {
        $bascula = Bascula::with(['proveedor', 'operario', 'canales', 'faenas'])
            ->findOrFail($id);
        
        return response()->json($bascula);
    }

    public function update(Request $request, $id)
    {
        $bascula = Bascula::findOrFail($id);

        $validated = $request->validate([
            'NumeroTicket'     => "string|unique:Basculas,NumeroTicket,{$id}",
            'GuiaMovilizacion' => "string|unique:Basculas,GuiaMovilizacion,{$id}",
            'Estado'           => 'string',
            'Observaciones'    => 'nullable|string',
        ]);

        $bascula->update($validated);

        return response()->json($bascula);
    }

    public function suggestions(Request $request)
    {
        $field = $request->input('field');
        $allowed = ['Procedencia', 'ProveedorNombre', 'ClienteNombre', 'PatentaCamion', 'Conductor'];
        if (!\in_array($field, $allowed, true)) {
            return response()->json([], 400);
        }

        // Escapar caracteres especiales de LIKE para evitar table scans por abuso
        $term = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], (string) $request->input('query', ''));

        return Bascula::where($field, 'like', "%{$term}%")
            ->distinct()
            ->orderBy($field)
            ->limit(10)
            ->pluck($field);
    }

    public function destroy($id)
    {
        $bascula = Bascula::findOrFail($id);
        $bascula->update(['Eliminado' => true]);

        return response()->json(null, 204);
    }
}
