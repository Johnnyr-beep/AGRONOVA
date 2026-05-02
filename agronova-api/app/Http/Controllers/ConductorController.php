<?php

namespace App\Http\Controllers;

use App\Models\Conductor;
use Illuminate\Http\Request;

class ConductorController extends Controller
{
    public function index()
    {
        return Conductor::where('Eliminado', false)->orderBy('Nombre')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'                   => 'required|string|max:150',
            'Apellido'                 => 'nullable|string|max:150',
            'Cedula'                   => 'nullable|string|max:30|unique:Conductores,Cedula',
            'Telefono'                 => 'nullable|string|max:50',
            'LicenciaCategoria'        => 'nullable|string|max:10',
            'FechaVencimientoLicencia' => 'nullable|date',
            'Activo'                   => 'boolean',
        ]);
        return response()->json(Conductor::create($validated), 201);
    }

    public function show($id)
    {
        return Conductor::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = Conductor::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'Nombre'                   => 'sometimes|required|string|max:150',
            'Apellido'                 => 'nullable|string|max:150',
            'Cedula'                   => 'nullable|string|max:30|unique:Conductores,Cedula,' . $id . ',Id',
            'Telefono'                 => 'nullable|string|max:50',
            'LicenciaCategoria'        => 'nullable|string|max:10',
            'FechaVencimientoLicencia' => 'nullable|date',
            'Activo'                   => 'boolean',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Conductor::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
