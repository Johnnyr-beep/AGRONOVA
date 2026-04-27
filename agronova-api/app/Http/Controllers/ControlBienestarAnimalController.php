<?php

namespace App\Http\Controllers;

use App\Models\ControlBienestarAnimal;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ControlBienestarAnimalController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'FaenaId' => 'required|exists:Faenas,Id',
            'Criterio' => 'required|string',
            'Cumplido' => 'required|boolean',
            'Observaciones' => 'nullable|string',
            'ControladoPor' => 'required|exists:Usuarios,Id',
        ]);

        $validated['FechaControl'] = Carbon::now();

        $control = ControlBienestarAnimal::create($validated);

        return response()->json($control, 201);
    }

    public function show($id)
    {
        return ControlBienestarAnimal::with(['faena', 'controlador'])->findOrFail($id);
    }
}
