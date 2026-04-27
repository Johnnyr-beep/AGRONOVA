<?php

namespace App\Http\Controllers;

use App\Models\Faena;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class FaenaController extends Controller
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
        $faena = Faena::with([
            'canal', 
            'bascula', 
            'veterinarioInspector', 
            'aprobadoPor', 
            'inspeccionesVeterinarias', 
            'controlesBienestar'
        ])->findOrFail($id);

        return response()->json($faena);
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

        $faena = Faena::create($validated);

        return response()->json($faena, 201);
    }

    public function update(Request $request, $id)
    {
        $faena = Faena::findOrFail($id);
        $validated = $request->validate([
            'Estado' => 'integer',
            'PesoCanal' => 'numeric',
            'EstadoSanitario' => 'integer',
        ]);

        $faena->update($validated);

        return response()->json($faena);
    }

    public function destroy($id)
    {
        $faena = Faena::findOrFail($id);
        $faena->update(['Eliminado' => true]);

        return response()->json(null, 204);
    }

    // Métodos de proceso
    public function insensibilizar(Request $request, $id)
    {
        $faena = Faena::findOrFail($id);
        $validated = $request->validate([
            'metodo' => 'required|integer',
        ]);

        $faena->update([
            'MetodoInsensibilizacion' => $validated['metodo'],
            'HoraInsensibilizacion' => Carbon::now(),
            'Estado' => 2, // InsensibilizadoCompleto
        ]);

        return response()->json(['success' => true]);
    }

    public function desangrar(Request $request, $id)
    {
        $faena = Faena::findOrFail($id);
        $validated = $request->validate([
            'metodo' => 'required|integer',
            'volumenSangreRecolectado' => 'nullable|numeric',
        ]);

        $faena->update([
            'MetodoDesangre' => $validated['metodo'],
            'VolumenSangreRecolectado' => $validated['volumenSangreRecolectado'],
            'HoraDesangre' => Carbon::now(),
            'Estado' => 3, // DesangradoCompleto
        ]);

        return response()->json(['success' => true]);
    }

    public function pelar($id)
    {
        $faena = Faena::findOrFail($id);
        $faena->update([
            'Pelado' => true,
            'HoraPelado' => Carbon::now(),
            'Estado' => 4, // PeladoCompleto
        ]);

        return response()->json(['success' => true]);
    }

    public function eviscerar($id)
    {
        $faena = Faena::findOrFail($id);
        $faena->update([
            'Eviscerado' => true,
            'HoraEviscerado' => Carbon::now(),
            'Estado' => 5, // EvisceradoCompleto
        ]);

        return response()->json(['success' => true]);
    }

    public function dividir($id)
    {
        $faena = Faena::findOrFail($id);
        $faena->update([
            'DivisionMedialsterna' => true,
            'HoraDivision' => Carbon::now(),
            'Estado' => 6, // DivisionCompleta
        ]);

        return response()->json(['success' => true]);
    }

    public function aprobar($id)
    {
        $faena = Faena::findOrFail($id);
        $faena->update([
            'Estado' => 8, // AprobadoVeterinario
            'AprobadoPorId' => auth()->user()->Id,
        ]);

        return response()->json($faena);
    }

    public function rechazar(Request $request, $id)
    {
        $faena = Faena::findOrFail($id);
        $validated = $request->validate([
            'razonRechazo' => 'required|string',
        ]);

        $faena->update([
            'Estado' => 9, // RechazadoVeterinario
            'ResultadoInspeccionPost' => $validated['razonRechazo'],
        ]);

        return response()->json($faena);
    }
}
