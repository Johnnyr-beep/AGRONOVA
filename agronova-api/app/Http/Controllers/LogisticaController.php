<?php

namespace App\Http\Controllers;

use App\Models\Logistica;
use Illuminate\Http\Request;

class LogisticaController extends Controller
{
    public function index()
    {
        return Logistica::where('Eliminado', false)->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroLogistica' => 'required|string|max:50|unique:Logistica,NumeroLogistica',
            'FechaLogistica'  => 'nullable|date',
            'DespachoId'      => 'nullable|uuid',
            'VehiculoId'      => 'nullable|uuid',
            'VehiculoPlaca'   => 'nullable|string|max:20',
            'ConductorId'     => 'nullable|uuid',
            'ConductorNombre' => 'nullable|string|max:200',
            'Origen'          => 'nullable|string|max:200',
            'Destino'         => 'nullable|string|max:200',
            'Estado'          => 'nullable|string|max:50',
            'Observaciones'   => 'nullable|string',
        ]);
        $validated['CreadoPor'] = auth()->user()->getKey();
        return response()->json(Logistica::create($validated), 201);
    }

    public function show($id)
    {
        return Logistica::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = Logistica::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'NumeroLogistica' => 'sometimes|required|string|max:50|unique:Logistica,NumeroLogistica,' . $id . ',Id',
            'FechaLogistica'  => 'nullable|date',
            'DespachoId'      => 'nullable|uuid',
            'VehiculoId'      => 'nullable|uuid',
            'VehiculoPlaca'   => 'nullable|string|max:20',
            'ConductorId'     => 'nullable|uuid',
            'ConductorNombre' => 'nullable|string|max:200',
            'Origen'          => 'nullable|string|max:200',
            'Destino'         => 'nullable|string|max:200',
            'Estado'          => 'nullable|string|max:50',
            'Observaciones'   => 'nullable|string',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Logistica::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
