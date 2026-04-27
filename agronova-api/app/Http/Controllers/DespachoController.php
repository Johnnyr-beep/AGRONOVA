<?php

namespace App\Http\Controllers;

use App\Models\Despacho;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DespachoController extends Controller
{
    public function index()
    {
        return Despacho::where('Eliminado', false)
            ->with(['cliente', 'responsable'])
            ->orderBy('FechaDespacho', 'desc')
            ->get();
    }

    public function show($id)
    {
        $despacho = Despacho::with(['cliente', 'responsable', 'productosDesposte'])
            ->findOrFail($id);
        
        return response()->json($despacho);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroDespacho' => 'required|unique:Despachos',
            'ClienteId' => 'required|exists:Clientes,Id',
            'PatentaVehiculo' => 'required',
            'TransportistaNombre' => 'required',
            'TemperaturaVehiculo' => 'required|numeric|max:5',
        ]);

        $validated['Estado'] = 0; // Pendiente
        $validated['FechaDespacho'] = Carbon::now();
        $validated['CreadoPor'] = auth()->user()->Id;
        $validated['ResponsableDespachoId'] = auth()->user()->Id;

        $despacho = Despacho::create($validated);

        return response()->json($despacho, 201);
    }

    public function update(Request $request, $id)
    {
        $despacho = Despacho::findOrFail($id);
        $validated = $request->validate([
            'Estado' => 'integer',
            'DireccionDestino' => 'string',
            'NumeroFactura' => 'string',
            'TemperaturaVehiculo' => 'numeric|max:5',
        ]);

        if (isset($validated['Estado']) && $validated['Estado'] == 3) { // Despachado
            $validated['FechaSalida'] = Carbon::now();
        }

        $despacho->update($validated);

        return response()->json($despacho);
    }

    public function confirmar($id)
    {
        $despacho = Despacho::findOrFail($id);
        $despacho->update([
            'Estado' => 4, // Entregado
            'FechaEntregaConfirmada' => Carbon::now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $despacho = Despacho::findOrFail($id);
        $despacho->update(['Eliminado' => true]);

        return response()->json(null, 204);
    }
}
