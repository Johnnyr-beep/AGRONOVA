<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function index()
    {
        return Vehiculo::where('Eliminado', false)->orderBy('Placa')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Placa'        => 'required|string|max:20|unique:Vehiculos,Placa',
            'Marca'        => 'nullable|string|max:100',
            'Modelo'       => 'nullable|string|max:100',
            'Tipo'         => 'nullable|string|max:50',
            'CapacidadKg'  => 'nullable|numeric|min:0',
            'ConductorId'  => 'nullable|uuid',
            'Activo'       => 'boolean',
        ]);
        return response()->json(Vehiculo::create($validated), 201);
    }

    public function show($id)
    {
        return Vehiculo::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = Vehiculo::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'Placa'       => 'sometimes|required|string|max:20|unique:Vehiculos,Placa,' . $id . ',Id',
            'Marca'       => 'nullable|string|max:100',
            'Modelo'      => 'nullable|string|max:100',
            'Tipo'        => 'nullable|string|max:50',
            'CapacidadKg' => 'nullable|numeric|min:0',
            'ConductorId' => 'nullable|uuid',
            'Activo'      => 'boolean',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Vehiculo::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
