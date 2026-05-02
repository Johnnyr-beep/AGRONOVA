<?php
namespace App\Http\Controllers;

use App\Models\Piel;
use Illuminate\Http\Request;

class PielController extends Controller
{
    public function index()
    {
        $pieles = Piel::where('Eliminado', false)
            ->orderBy('created_at', 'desc')
            ->paginate(50);
        return response()->json($pieles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'CanalId'      => 'nullable|uuid',
            'FechaRegistro'=> 'nullable|date',
            'PesoKg'       => 'nullable|numeric|min:0',
            'Estado'       => 'nullable|in:Disponible,Vendida,Descartada',
            'Destino'      => 'nullable|string|max:255',
            'PrecioKg'     => 'nullable|numeric|min:0',
            'ValorTotal'   => 'nullable|numeric|min:0',
            'Observaciones'=> 'nullable|string',
        ]);

        $piel = Piel::create($validated);
        return response()->json($piel, 201);
    }

    public function show($id)
    {
        $piel = Piel::findOrFail($id);
        return response()->json($piel);
    }

    public function update(Request $request, $id)
    {
        $piel = Piel::findOrFail($id);

        $validated = $request->validate([
            'CanalId'      => 'nullable|uuid',
            'FechaRegistro'=> 'nullable|date',
            'PesoKg'       => 'nullable|numeric|min:0',
            'Estado'       => 'nullable|in:Disponible,Vendida,Descartada',
            'Destino'      => 'nullable|string|max:255',
            'PrecioKg'     => 'nullable|numeric|min:0',
            'ValorTotal'   => 'nullable|numeric|min:0',
            'Observaciones'=> 'nullable|string',
        ]);

        $piel->update($validated);
        return response()->json($piel);
    }

    public function destroy($id)
    {
        $piel = Piel::findOrFail($id);
        $piel->update(['Eliminado' => true]);
        return response()->json(['message' => 'Piel eliminada']);
    }
}
