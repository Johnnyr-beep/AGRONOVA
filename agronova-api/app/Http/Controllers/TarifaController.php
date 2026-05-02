<?php

namespace App\Http\Controllers;

use App\Models\Tarifa;
use Illuminate\Http\Request;

class TarifaController extends Controller
{
    public function index()
    {
        return Tarifa::where('Eliminado', false)->orderBy('Nombre')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'       => 'required|string|max:200',
            'TipoServicio' => 'nullable|string|max:100',
            'ValorBase'    => 'nullable|numeric|min:0',
            'ValorPorKm'   => 'nullable|numeric|min:0',
            'Activo'       => 'boolean',
        ]);
        return response()->json(Tarifa::create($validated), 201);
    }

    public function show($id)
    {
        return Tarifa::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = Tarifa::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'Nombre'       => 'sometimes|required|string|max:200',
            'TipoServicio' => 'nullable|string|max:100',
            'ValorBase'    => 'nullable|numeric|min:0',
            'ValorPorKm'   => 'nullable|numeric|min:0',
            'Activo'       => 'boolean',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Tarifa::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
