<?php

namespace App\Http\Controllers;

use App\Models\ListaPrecio;
use Illuminate\Http\Request;

class ListaPrecioController extends Controller
{
    public function index()
    {
        return ListaPrecio::where('Eliminado', false)->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ClienteId'      => 'nullable|uuid',
            'ClienteNombre'  => 'nullable|string|max:200',
            'TipoProductoId' => 'nullable|uuid',
            'ProductoNombre' => 'nullable|string|max:200',
            'PrecioKg'       => 'required|numeric|min:0',
            'FechaVigencia'  => 'nullable|date',
            'Estado'         => 'nullable|string|max:50',
            'Observaciones'  => 'nullable|string',
        ]);
        return response()->json(ListaPrecio::create($validated), 201);
    }

    public function show($id)
    {
        return ListaPrecio::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = ListaPrecio::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'ClienteId'      => 'nullable|uuid',
            'ClienteNombre'  => 'nullable|string|max:200',
            'TipoProductoId' => 'nullable|uuid',
            'ProductoNombre' => 'nullable|string|max:200',
            'PrecioKg'       => 'sometimes|required|numeric|min:0',
            'FechaVigencia'  => 'nullable|date',
            'Estado'         => 'nullable|string|max:50',
            'Observaciones'  => 'nullable|string',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = ListaPrecio::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
