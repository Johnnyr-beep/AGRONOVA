<?php

namespace App\Http\Controllers;

use App\Models\InspeccionVeterinaria;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class InspeccionVeterinarioController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'FaenaId' => 'required|exists:Faenas,Id',
            'TipoInspeccion' => 'required|integer',
            'VeterinarioId' => 'required|exists:Usuarios,Id',
            'Observaciones' => 'nullable|string',
            'Aprobado' => 'required|boolean',
            'RazonRechazo' => 'nullable|string',
        ]);

        $validated['FechaInspeccion'] = Carbon::now();
        $validated['CreadoPor'] = auth()->user()->Id;

        $inspeccion = InspeccionVeterinaria::create($validated);

        return response()->json($inspeccion, 201);
    }

    public function show($id)
    {
        return InspeccionVeterinaria::with(['faena', 'veterinario'])->findOrFail($id);
    }
}
