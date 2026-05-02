<?php
namespace App\Http\Controllers;

use App\Models\Cava;
use Illuminate\Http\Request;

class CavaController extends Controller
{
    public function index()
    {
        $cavas = Cava::where('Eliminado', false)
            ->where('Activo', true)
            ->orderBy('Numero')
            ->get();
        return response()->json($cavas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'              => 'required|string|max:255',
            'Numero'              => 'nullable|integer',
            'CapacidadCanales'    => 'nullable|integer',
            'TemperaturaObjetivo' => 'nullable|numeric',
            'TemperaturaActual'   => 'nullable|numeric',
            'Estado'              => 'nullable|in:Disponible,Llena,Mantenimiento',
            'Descripcion'         => 'nullable|string',
        ]);

        $cava = Cava::create($validated);
        return response()->json($cava, 201);
    }

    public function show($id)
    {
        $cava = Cava::findOrFail($id);
        return response()->json($cava);
    }

    public function update(Request $request, $id)
    {
        $cava = Cava::findOrFail($id);

        $validated = $request->validate([
            'Nombre'              => 'sometimes|string|max:255',
            'Numero'              => 'nullable|integer',
            'CapacidadCanales'    => 'nullable|integer',
            'TemperaturaObjetivo' => 'nullable|numeric',
            'TemperaturaActual'   => 'nullable|numeric',
            'Estado'              => 'nullable|in:Disponible,Llena,Mantenimiento',
            'Descripcion'         => 'nullable|string',
            'Activo'              => 'nullable|boolean',
        ]);

        $cava->update($validated);
        return response()->json($cava);
    }

    public function destroy($id)
    {
        $cava = Cava::findOrFail($id);
        $cava->update(['Eliminado' => true]);
        return response()->json(['message' => 'Cava eliminada']);
    }
}
