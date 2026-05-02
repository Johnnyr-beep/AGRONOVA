<?php

namespace App\Http\Controllers;

use App\Models\ProductoDesposte;
use Illuminate\Http\Request;

class ProductoDesposteController extends Controller
{
    public function byDesposte($desposteId)
    {
        return ProductoDesposte::where('DesposteId', $desposteId)
            ->with('tipoProducto')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'DesposteId'                => 'required|uuid',
            'TipoProductoId'            => 'nullable|uuid',
            'NumeroProducto'            => 'nullable|string|max:50',
            'CodigoLote'                => 'nullable|string|max:100',
            'PesoKg'                    => 'required|numeric|min:0',
            'Lote'                      => 'nullable|string|max:100',
            'Destino'                   => 'nullable|string|max:200',
            'Estado'                    => 'nullable|string|max:50',
            'FechaGeneracion'           => 'nullable|date',
            'TemperaturaAlmacenamiento' => 'nullable|numeric',
            'FechaLimiteProcesamiento'  => 'nullable|date',
            'Observaciones'             => 'nullable|string',
        ]);

        $validated['CreadoPor'] = auth()->user()->getKey();
        $validated['Estado']    = $validated['Estado'] ?? 'Disponible';

        $producto = ProductoDesposte::create($validated);
        return response()->json($producto->load('tipoProducto'), 201);
    }

    public function show($id)
    {
        return ProductoDesposte::with('tipoProducto')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $producto = ProductoDesposte::findOrFail($id);
        $validated = $request->validate([
            'TipoProductoId'            => 'nullable|uuid',
            'NumeroProducto'            => 'nullable|string|max:50',
            'CodigoLote'                => 'nullable|string|max:100',
            'PesoKg'                    => 'sometimes|required|numeric|min:0',
            'Lote'                      => 'nullable|string|max:100',
            'Destino'                   => 'nullable|string|max:200',
            'Estado'                    => 'nullable|string|max:50',
            'FechaGeneracion'           => 'nullable|date',
            'TemperaturaAlmacenamiento' => 'nullable|numeric',
            'FechaLimiteProcesamiento'  => 'nullable|date',
            'Observaciones'             => 'nullable|string',
        ]);

        $producto->update($validated);
        return response()->json($producto->load('tipoProducto'));
    }

    public function destroy($id)
    {
        ProductoDesposte::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
