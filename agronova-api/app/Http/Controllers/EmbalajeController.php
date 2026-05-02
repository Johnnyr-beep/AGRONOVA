<?php
namespace App\Http\Controllers;

use App\Models\Embalaje;
use Illuminate\Http\Request;

class EmbalajeController extends Controller
{
    public function index()
    {
        $embalajes = Embalaje::where('Eliminado', false)
            ->orderBy('created_at', 'desc')
            ->paginate(50);
        return response()->json($embalajes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroEmbalaje'      => 'required|string|unique:Embalajes,NumeroEmbalaje',
            'FechaEmbalaje'       => 'nullable|date',
            'TipoProductoId'      => 'nullable|uuid',
            'ProductoDesposteId'  => 'nullable|uuid',
            'PesoNeto'            => 'nullable|numeric|min:0',
            'PesoBruto'           => 'nullable|numeric|min:0',
            'PesoTara'            => 'nullable|numeric|min:0',
            'CantidadUnidades'    => 'nullable|integer|min:1',
            'TemperaturaProducto' => 'nullable|numeric',
            'Lote'                => 'nullable|string|max:255',
            'FechaVencimiento'    => 'nullable|date',
            'CodigoBarras'        => 'nullable|string|unique:Embalajes,CodigoBarras',
            'Estado'              => 'nullable|in:Pendiente,Embalado,Despachado',
            'Observaciones'       => 'nullable|string',
        ]);

        $validated['OperarioId'] = auth()->user()->getKey();

        $embalaje = Embalaje::create($validated);
        return response()->json($embalaje, 201);
    }

    public function show($id)
    {
        $embalaje = Embalaje::findOrFail($id);
        return response()->json($embalaje);
    }

    public function update(Request $request, $id)
    {
        $embalaje = Embalaje::findOrFail($id);

        $validated = $request->validate([
            'NumeroEmbalaje'      => 'sometimes|string|unique:Embalajes,NumeroEmbalaje,' . $id . ',Id',
            'FechaEmbalaje'       => 'nullable|date',
            'TipoProductoId'      => 'nullable|uuid',
            'ProductoDesposteId'  => 'nullable|uuid',
            'PesoNeto'            => 'nullable|numeric|min:0',
            'PesoBruto'           => 'nullable|numeric|min:0',
            'PesoTara'            => 'nullable|numeric|min:0',
            'CantidadUnidades'    => 'nullable|integer|min:1',
            'TemperaturaProducto' => 'nullable|numeric',
            'Lote'                => 'nullable|string|max:255',
            'FechaVencimiento'    => 'nullable|date',
            'CodigoBarras'        => 'nullable|string|unique:Embalajes,CodigoBarras,' . $id . ',Id',
            'Estado'              => 'nullable|in:Pendiente,Embalado,Despachado',
            'Observaciones'       => 'nullable|string',
        ]);

        $embalaje->update($validated);
        return response()->json($embalaje);
    }

    public function destroy($id)
    {
        $embalaje = Embalaje::findOrFail($id);
        $embalaje->update(['Eliminado' => true]);
        return response()->json(['message' => 'Embalaje eliminado']);
    }
}
