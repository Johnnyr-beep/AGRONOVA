<?php

namespace App\Http\Controllers;

use App\Models\Conservacion;
use Illuminate\Http\Request;

class ConservacionController extends Controller
{
    public function index()
    {
        return Conservacion::where('Eliminado', false)->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'CavaId'        => 'nullable|uuid',
            'CavaNombre'    => 'nullable|string|max:150',
            'FechaRegistro' => 'nullable|date',
            'Temperatura'   => 'nullable|numeric',
            'Humedad'       => 'nullable|numeric|min:0|max:100',
            'Estado'        => 'nullable|string|max:50',
            'OperarioId'    => 'nullable|uuid',
            'Observaciones' => 'nullable|string',
        ]);
        return response()->json(Conservacion::create($validated), 201);
    }

    public function show($id)
    {
        return Conservacion::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = Conservacion::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'CavaId'        => 'nullable|uuid',
            'CavaNombre'    => 'nullable|string|max:150',
            'FechaRegistro' => 'nullable|date',
            'Temperatura'   => 'nullable|numeric',
            'Humedad'       => 'nullable|numeric|min:0|max:100',
            'Estado'        => 'nullable|string|max:50',
            'Observaciones' => 'nullable|string',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Conservacion::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
