<?php

namespace App\Http\Controllers;

use App\Models\TipoProducto;
use Illuminate\Http\Request;

class TipoProductoController extends Controller
{
    public function index()
    {
        return TipoProducto::where('Activo', true)
            ->orderBy('Nombre', 'asc')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'                  => 'required|string',
            'Codigo'                  => 'nullable|string|unique:TiposProductos',
            'Clasificacion'           => 'nullable|string',
            'Descripcion'             => 'nullable|string',
            'PrecioBaseKg'            => 'nullable|numeric|min:0',
            'PesoMinimo'              => 'nullable|numeric|min:0',
            'PesoMaximo'              => 'nullable|numeric|min:0',
            'TemperaturaOptima'       => 'nullable|numeric',
            'DiasVidaUtil'            => 'nullable|integer|min:0',
            'RequiereControlCalidad'  => 'nullable|boolean',
        ]);

        $validated['Activo'] = true;

        return response()->json(TipoProducto::create($validated), 201);
    }

    public function show($id)
    {
        return response()->json(TipoProducto::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $tipo = TipoProducto::findOrFail($id);

        $validated = $request->validate([
            'Nombre'                  => 'nullable|string',
            'Codigo'                  => "nullable|string|unique:TiposProductos,Codigo,{$id}",
            'Clasificacion'           => 'nullable|string',
            'Descripcion'             => 'nullable|string',
            'PrecioBaseKg'            => 'nullable|numeric|min:0',
            'PesoMinimo'              => 'nullable|numeric|min:0',
            'PesoMaximo'              => 'nullable|numeric|min:0',
            'TemperaturaOptima'       => 'nullable|numeric',
            'DiasVidaUtil'            => 'nullable|integer|min:0',
            'RequiereControlCalidad'  => 'nullable|boolean',
            'Activo'                  => 'nullable|boolean',
        ]);

        $tipo->update($validated);

        return response()->json($tipo);
    }

    public function destroy($id)
    {
        $tipo = TipoProducto::findOrFail($id);
        $tipo->update(['Activo' => false]);

        return response()->json(null, 204);
    }
}
