<?php

namespace App\Http\Controllers;

use App\Models\Beneficio;
use App\Models\AnimalBeneficio;
use Illuminate\Http\Request;

class BeneficioController extends Controller
{
    public function index(Request $request)
    {
        $query = Beneficio::where('Eliminado', false)
            ->withCount([
                'animales as TotalAnimales' => fn($q) => $q->where('Eliminado', false),
                'animales as TotalVivos'    => fn($q) => $q->where('Eliminado', false)->where('Estado', 'Vivo'),
                'animales as TotalTumbados' => fn($q) => $q->where('Eliminado', false)->where('Estado', 'Tumbado'),
            ])
            ->orderBy('Fecha', 'desc')
            ->orderBy('created_at', 'desc');

        if ($request->has('fecha')) {
            $query->whereDate('Fecha', $request->fecha);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroOrden'   => 'required|string|unique:Beneficios',
            'Fecha'         => 'required|date',
            'ClienteNit'    => 'nullable|string',
            'ClienteNombre' => 'required|string',
            'ModoImpresion' => 'nullable|string|in:MANUAL,AUTO',
        ]);

        $validated['Estado']    = 'Abierto';
        $validated['Eliminado'] = false;

        $beneficio = Beneficio::create($validated);

        return response()->json($beneficio, 201);
    }

    public function show($id)
    {
        $beneficio = Beneficio::with(['animales' => fn($q) => $q->where('Eliminado', false)->orderBy('Turno')])
            ->findOrFail($id);

        return response()->json($beneficio);
    }

    public function update(Request $request, $id)
    {
        $beneficio = Beneficio::findOrFail($id);

        $validated = $request->validate([
            'ClienteNit'    => 'nullable|string',
            'ClienteNombre' => 'nullable|string',
            'ModoImpresion' => 'nullable|string|in:MANUAL,AUTO',
            'Estado'        => 'nullable|string|in:Abierto,Cerrado',
        ]);

        $beneficio->update($validated);

        return response()->json($beneficio);
    }

    public function destroy($id)
    {
        $beneficio = Beneficio::findOrFail($id);
        $beneficio->update(['Eliminado' => true]);

        return response()->json(null, 204);
    }

    public function aprobar($id)
    {
        $beneficio = Beneficio::findOrFail($id);
        $beneficio->update(['Estado' => 'Cerrado']);

        return response()->json($beneficio);
    }

    public function rechazar(Request $request, $id)
    {
        $beneficio = Beneficio::findOrFail($id);
        $beneficio->update(['Estado' => 'Rechazado']);

        return response()->json($beneficio);
    }

    // --- Animales ---

    public function addAnimal(Request $request, $id)
    {
        $beneficio = Beneficio::findOrFail($id);

        $validated = $request->validate([
            'Turno'                  => 'required|integer',
            'NumeroAnimal'           => 'nullable|integer',
            'TipoAnimal'             => 'nullable|string',
            'PesoKg'                 => 'nullable|numeric',
            'ObservacionesCamionera' => 'nullable|string',
        ]);

        $validated['BeneficioId'] = $beneficio->getKey();
        $validated['Estado']      = 'Vivo';
        $validated['Eliminado']   = false;

        $animal = AnimalBeneficio::create($validated);

        return response()->json($animal, 201);
    }

    public function updateAnimal(Request $request, $id, $animalId)
    {
        $animal = AnimalBeneficio::where('BeneficioId', $id)->findOrFail($animalId);

        $validated = $request->validate([
            'PesoKg'                 => 'nullable|numeric',
            'Estado'                 => 'nullable|string|in:Vivo,Tumbado',
            'TipoAnimal'             => 'nullable|string',
            'ObservacionesCamionera' => 'nullable|string',
        ]);

        $animal->update($validated);

        return response()->json($animal);
    }

    public function removeAnimal($id, $animalId)
    {
        $animal = AnimalBeneficio::where('BeneficioId', $id)->findOrFail($animalId);
        $animal->update(['Eliminado' => true]);

        return response()->json(null, 204);
    }
}
