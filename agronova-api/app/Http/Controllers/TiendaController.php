<?php

namespace App\Http\Controllers;

use App\Models\Tienda;
use Illuminate\Http\Request;

class TiendaController extends Controller
{
    public function index()
    {
        return Tienda::where('Eliminado', false)->orderBy('Nombre')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'      => 'required|string|max:200',
            'Codigo'      => 'nullable|string|max:50|unique:Tiendas,Codigo',
            'Direccion'   => 'nullable|string|max:300',
            'Ciudad'      => 'nullable|string|max:100',
            'Telefono'    => 'nullable|string|max:50',
            'Responsable' => 'nullable|string|max:150',
            'Activo'      => 'boolean',
        ]);
        return response()->json(Tienda::create($validated), 201);
    }

    public function show($id)
    {
        return Tienda::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = Tienda::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'Nombre'      => 'sometimes|required|string|max:200',
            'Codigo'      => 'nullable|string|max:50|unique:Tiendas,Codigo,' . $id . ',Id',
            'Direccion'   => 'nullable|string|max:300',
            'Ciudad'      => 'nullable|string|max:100',
            'Telefono'    => 'nullable|string|max:50',
            'Responsable' => 'nullable|string|max:150',
            'Activo'      => 'boolean',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Tienda::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
