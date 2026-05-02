<?php

namespace App\Http\Controllers;

use App\Models\Sede;
use Illuminate\Http\Request;

class SedeController extends Controller
{
    public function index()
    {
        return Sede::where('Eliminado', false)->orderBy('Nombre')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'      => 'required|string|max:200',
            'ClienteId'   => 'nullable|uuid',
            'ProveedorId' => 'nullable|uuid',
            'Direccion'   => 'nullable|string|max:300',
            'Ciudad'      => 'nullable|string|max:100',
            'Telefono'    => 'nullable|string|max:50',
            'Contacto'    => 'nullable|string|max:150',
            'Activo'      => 'boolean',
        ]);
        return response()->json(Sede::create($validated), 201);
    }

    public function show($id)
    {
        return Sede::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $sede = Sede::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'Nombre'      => 'sometimes|required|string|max:200',
            'ClienteId'   => 'nullable|uuid',
            'ProveedorId' => 'nullable|uuid',
            'Direccion'   => 'nullable|string|max:300',
            'Ciudad'      => 'nullable|string|max:100',
            'Telefono'    => 'nullable|string|max:50',
            'Contacto'    => 'nullable|string|max:150',
            'Activo'      => 'boolean',
        ]);
        $sede->update($validated);
        return response()->json($sede);
    }

    public function destroy($id)
    {
        $sede = Sede::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $sede->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
