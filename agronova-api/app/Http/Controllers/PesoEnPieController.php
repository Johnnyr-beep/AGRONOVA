<?php

namespace App\Http\Controllers;

use App\Models\PesoEnPie;
use Illuminate\Http\Request;

class PesoEnPieController extends Controller
{
    public function index()
    {
        return PesoEnPie::where('Eliminado', false)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Fecha' => 'required|date',
            'GuiaMovilizacion' => 'required|string',
            'ProveedorNombre' => 'required|string',
            'ClienteNombre' => 'required|string',
            'TipoAnimal' => 'required|in:MACHO,HEMBRA,BUFALO,BUFALA',
            'UbicacionCorral' => 'required|string',
            'PesoKg' => 'required|numeric|min:1',
            'Observaciones' => 'nullable|string',
        ]);

        // Auto-generar consecutivo
        $lastRecord = PesoEnPie::orderBy('created_at', 'desc')->first();
        $nextNum = $lastRecord ? (intval(substr($lastRecord->Consecutivo, 3)) + 1) : 1;
        $validated['Consecutivo'] = 'PP-' . str_pad($nextNum, 5, '0', STR_PAD_LEFT);

        $pesoEnPie = PesoEnPie::create($validated);

        return response()->json($pesoEnPie, 201);
    }

    public function show($id)
    {
        return PesoEnPie::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $pesoEnPie = PesoEnPie::findOrFail($id);

        $validated = $request->validate([
            'Fecha' => 'date',
            'GuiaMovilizacion' => 'string',
            'ProveedorNombre' => 'string',
            'ClienteNombre' => 'string',
            'TipoAnimal' => 'in:MACHO,HEMBRA,BUFALO,BUFALA',
            'UbicacionCorral' => 'string',
            'PesoKg' => 'numeric|min:1',
            'Observaciones' => 'nullable|string',
            'Estado' => 'string',
        ]);

        $pesoEnPie->update($validated);

        return response()->json($pesoEnPie);
    }

    public function destroy($id)
    {
        $pesoEnPie = PesoEnPie::findOrFail($id);
        $pesoEnPie->update(['Eliminado' => true]);

        return response()->json(null, 204);
    }

    public function suggestions(Request $request)
    {
        $field = $request->get('field');
        if (!in_array($field, ['GuiaMovilizacion', 'ProveedorNombre', 'ClienteNombre'])) {
            return response()->json([], 400);
        }

        return PesoEnPie::where($field, 'like', '%' . $request->get('query') . '%')
            ->distinct()
            ->orderBy($field)
            ->limit(10)
            ->pluck($field);
    }

    public function stats()
    {
        $today = now()->toDateString();
        $records = PesoEnPie::where('Eliminado', false)
            ->whereDate('Fecha', $today)
            ->get();

        return response()->json([
            'totalAnimales' => $records->count(),
            'pesoTotal' => $records->sum('PesoKg'),
            'guiasAbiertas' => PesoEnPie::where('Eliminado', false)
                ->where('Estado', 'Abierto')
                ->distinct('GuiaMovilizacion')
                ->count('GuiaMovilizacion'),
        ]);
    }
}
