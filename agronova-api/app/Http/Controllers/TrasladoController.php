<?php
namespace App\Http\Controllers;

use App\Models\Traslado;
use Illuminate\Http\Request;

class TrasladoController extends Controller
{
    public function index()
    {
        $traslados = Traslado::where('Eliminado', false)
            ->orderBy('created_at', 'desc')
            ->paginate(50);
        return response()->json($traslados);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroTraslado' => 'required|string|unique:Traslados,NumeroTraslado',
            'FechaTraslado'  => 'nullable|date',
            'CanalId'        => 'nullable|uuid',
            'CavaOrigenId'   => 'nullable|uuid',
            'CavaDestinoId'  => 'nullable|uuid',
            'Origen'         => 'nullable|string|max:255',
            'Destino'        => 'nullable|string|max:255',
            'Observaciones'  => 'nullable|string',
        ]);

        $validated['OperarioId'] = auth()->user()->getKey();

        $traslado = Traslado::create($validated);
        return response()->json($traslado, 201);
    }

    public function show($id)
    {
        $traslado = Traslado::findOrFail($id);
        return response()->json($traslado);
    }

    public function update(Request $request, $id)
    {
        $traslado = Traslado::findOrFail($id);

        $validated = $request->validate([
            'NumeroTraslado' => 'sometimes|string|unique:Traslados,NumeroTraslado,' . $id . ',Id',
            'FechaTraslado'  => 'nullable|date',
            'CanalId'        => 'nullable|uuid',
            'CavaOrigenId'   => 'nullable|uuid',
            'CavaDestinoId'  => 'nullable|uuid',
            'Origen'         => 'nullable|string|max:255',
            'Destino'        => 'nullable|string|max:255',
            'Estado'         => 'nullable|string|max:50',
            'Observaciones'  => 'nullable|string',
        ]);

        $traslado->update($validated);
        return response()->json($traslado);
    }

    public function destroy($id)
    {
        $traslado = Traslado::findOrFail($id);
        $traslado->update(['Eliminado' => true]);
        return response()->json(['message' => 'Traslado eliminado']);
    }

    public function ejecutar($id)
    {
        $traslado = Traslado::findOrFail($id);
        $traslado->update(['Estado' => 'Ejecutado']);
        return response()->json($traslado);
    }
}
