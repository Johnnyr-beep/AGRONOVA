<?php

namespace App\Http\Controllers;

use App\Models\Canal;
use Illuminate\Http\Request;

class CanalController extends Controller
{
    public function index(Request $request)
    {
        $query = Canal::where('Eliminado', false);

        if ($request->input('estado') !== null) {
            $query->where('Estado', $request->input('estado'));
        }

        return $query->with(['proveedor'])->orderBy('created_at', 'desc')->paginate(50);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroCanal'        => 'required|string|unique:Canales',
            'NumeroOreja'        => 'nullable|string',
            'BasiculaId'         => 'nullable|uuid',
            'TipoAnimal'         => 'required|in:PORCINO,BOVINO,OVINO,OTROS',
            'PesoVivo'           => 'nullable|numeric|min:0',
            'PesoCanalCaliente'  => 'nullable|numeric|min:0',
            'PesoCanalFria'      => 'nullable|numeric|min:0',
            'FechaFaena'         => 'nullable|date',
            'FechaRefrigeracion' => 'nullable|date',
            'AptilizadoFaena'    => 'nullable|boolean',
            'ObservacionesFaena' => 'nullable|string',
            'ProveedorId'        => 'nullable|uuid',
        ]);

        $validated['Estado'] = 0;
        $validated['CreadoPor'] = auth()->user()->getKey();

        return response()->json(Canal::create($validated), 201);
    }

    public function show($id)
    {
        return response()->json(
            Canal::with(['bascula', 'proveedor'])->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $canal = Canal::findOrFail($id);

        $validated = $request->validate([
            'NumeroCanal'        => "nullable|string|unique:Canales,NumeroCanal,{$id}",
            'NumeroOreja'        => 'nullable|string',
            'TipoAnimal'         => 'nullable|in:PORCINO,BOVINO,OVINO,OTROS',
            'PesoVivo'           => 'nullable|numeric|min:0',
            'PesoCanalCaliente'  => 'nullable|numeric|min:0',
            'PesoCanalFria'      => 'nullable|numeric|min:0',
            'FechaFaena'         => 'nullable|date',
            'FechaRefrigeracion' => 'nullable|date',
            'Estado'             => 'nullable|integer',
            'AptilizadoFaena'    => 'nullable|boolean',
            'ObservacionesFaena' => 'nullable|string',
        ]);

        $validated['ModificadoPor'] = auth()->user()->getKey();
        $canal->update($validated);

        return response()->json($canal);
    }

    public function destroy($id)
    {
        $canal = Canal::findOrFail($id);
        $canal->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }

    public function suggestions(Request $request)
    {
        $allowed = ['NumeroCanal', 'NumeroOreja', 'TipoAnimal'];
        $field = $request->input('field');
        $query = $request->input('query', '');

        if (!in_array($field, $allowed)) {
            return response()->json(['error' => 'Campo no permitido'], 422);
        }

        $escaped = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $query);

        return Canal::where('Eliminado', false)
            ->where($field, 'ILIKE', "{$escaped}%")
            ->distinct()
            ->limit(10)
            ->pluck($field);
    }
}
