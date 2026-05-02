<?php

namespace App\Http\Controllers;

use App\Models\Bodega;
use Illuminate\Http\Request;

class BodegaController extends Controller
{
    public function index()
    {
        return Bodega::where('Eliminado', false)->orderBy('Nombre')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'    => 'required|string|max:200',
            'Codigo'    => 'nullable|string|max:50|unique:Bodegas,Codigo',
            'Tipo'      => 'nullable|string|max:50',
            'CavaId'    => 'nullable|uuid',
            'Capacidad' => 'nullable|integer|min:0',
            'Estado'    => 'nullable|string|max:50',
            'Activo'    => 'boolean',
        ]);
        return response()->json(Bodega::create($validated), 201);
    }

    public function show($id)
    {
        return Bodega::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = Bodega::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'Nombre'    => 'sometimes|required|string|max:200',
            'Codigo'    => 'nullable|string|max:50|unique:Bodegas,Codigo,' . $id . ',Id',
            'Tipo'      => 'nullable|string|max:50',
            'CavaId'    => 'nullable|uuid',
            'Capacidad' => 'nullable|integer|min:0',
            'Estado'    => 'nullable|string|max:50',
            'Activo'    => 'boolean',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Bodega::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
