<?php

namespace App\Http\Controllers;

use App\Models\Faena;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BeneficioController extends Controller
{
    public function index()
    {
        return Faena::where('Eliminado', false)
            ->with(['canal', 'bascula', 'veterinarioInspector', 'aprobadoPor'])
            ->orderBy('HoraInicio', 'desc')
            ->get();
    }

    public function show($id)
    {
        $beneficio = Faena::with([
            'canal', 
            'bascula', 
            'veterinarioInspector', 
            'aprobadoPor', 
            'inspeccionesVeterinarias', 
            'controlesBienestar'
        ])->findOrFail($id);

        return response()->json($beneficio);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'CanalId' => 'required|exists:Canales,Id',
            'BasculaId' => 'nullable|exists:Basculas,Id',
            'NumeroFaena' => 'required|unique:Faenas',
            'NumeroCanal' => 'required',
            'TipoAnimal' => 'required',
            'NumeroIdentificacion' => 'required',
            'PesoEntrada' => 'required|numeric',
        ]);

        $validated['Estado'] = 0; // Pendiente
        $validated['HoraInicio'] = Carbon::now();
        $validated['CreadoPor'] = $request->user()->Id;

        $beneficio = Faena::create($validated);

        return response()->json($beneficio, 201);
    }

    public function update(Request $request, $id)
    {
        $beneficio = Faena::findOrFail($id);
        $validated = $request->validate([
            'Estado' => 'integer',
            'PesoCanal' => 'numeric',
            'EstadoSanitario' => 'integer',
        ]);

        $beneficio->update($validated);

        return response()->json($beneficio);
    }

    // Métodos de proceso (Renombrados conceptualmente a Beneficio)
    public function insensibilizar(Request $request, $id)
    {
        $beneficio = Faena::findOrFail($id);
        $validated = $request->validate(['metodo' => 'required|integer']);

        $beneficio->update([
            'MetodoInsensibilizacion' => $validated['metodo'],
            'HoraInsensibilizacion' => Carbon::now(),
            'Estado' => 2,
        ]);

        return response()->json(['success' => true]);
    }

    public function desangrar(Request $request, $id)
    {
        $beneficio = Faena::findOrFail($id);
        $validated = $request->validate([
            'metodo' => 'required|integer',
            'volumenSangreRecolectado' => 'nullable|numeric',
        ]);

        $beneficio->update([
            'MetodoDesangre' => $validated['metodo'],
            'VolumenSangreRecolectado' => $validated['volumenSangreRecolectado'],
            'HoraDesangre' => Carbon::now(),
            'Estado' => 3,
        ]);

        return response()->json(['success' => true]);
    }

    public function pelar($id)
    {
        $beneficio = Faena::findOrFail($id);
        $beneficio->update([
            'Pelado' => true,
            'HoraPelado' => Carbon::now(),
            'Estado' => 4,
        ]);

        return response()->json(['success' => true]);
    }

    public function eviscerar($id)
    {
        $beneficio = Faena::findOrFail($id);
        $beneficio->update([
            'Eviscerado' => true,
            'HoraEviscerado' => Carbon::now(),
            'Estado' => 5,
        ]);

        return response()->json(['success' => true]);
    }

    public function dividir($id)
    {
        $beneficio = Faena::findOrFail($id);
        $beneficio->update([
            'DivisionMedialsterna' => true,
            'HoraDivision' => Carbon::now(),
            'Estado' => 6,
        ]);

        return response()->json(['success' => true]);
    }

    public function aprobar($id)
    {
        $beneficio = Faena::findOrFail($id);
        $beneficio->update([
            'Estado' => 8,
            'AprobadoPorId' => auth()->user()->Id,
        ]);

        return response()->json($beneficio);
    }

    public function rechazar(Request $request, $id)
    {
        $beneficio = Faena::findOrFail($id);
        $validated = $request->validate(['razonRechazo' => 'required|string']);

        $beneficio->update([
            'Estado' => 9,
            'ResultadoInspeccionPost' => $validated['razonRechazo'],
        ]);

        return response()->json($beneficio);
    }
}
