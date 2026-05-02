<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index()
    {
        return Categoria::where('Eliminado', false)->orderBy('Nombre')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'      => 'required|string|max:200',
            'Codigo'      => 'nullable|string|max:50|unique:Categorias,Codigo',
            'Descripcion' => 'nullable|string',
            'Activo'      => 'boolean',
        ]);
        return response()->json(Categoria::create($validated), 201);
    }

    public function show($id)
    {
        return Categoria::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = Categoria::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'Nombre'      => 'sometimes|required|string|max:200',
            'Codigo'      => 'nullable|string|max:50|unique:Categorias,Codigo,' . $id . ',Id',
            'Descripcion' => 'nullable|string',
            'Activo'      => 'boolean',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Categoria::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
