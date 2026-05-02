<?php
namespace App\Http\Controllers;

use App\Models\Liquidacion;
use Illuminate\Http\Request;

class LiquidacionController extends Controller
{
    public function index()
    {
        $liquidaciones = Liquidacion::where('Eliminado', false)
            ->orderBy('created_at', 'desc')
            ->paginate(50);
        return response()->json($liquidaciones);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroLiquidacion' => 'required|string|unique:Liquidaciones,NumeroLiquidacion',
            'FechaLiquidacion'  => 'nullable|date',
            'BeneficioId'       => 'nullable|uuid',
            'ProveedorId'       => 'nullable|uuid',
            'TotalAnimales'     => 'nullable|integer|min:0',
            'PesoTotalKg'       => 'nullable|numeric|min:0',
            'PrecioKg'          => 'nullable|numeric|min:0',
            'ValorBruto'        => 'nullable|numeric|min:0',
            'Deducciones'       => 'nullable|numeric|min:0',
            'ValorNeto'         => 'nullable|numeric|min:0',
            'Estado'            => 'nullable|in:Pendiente,Aprobada,Pagada',
            'FechaPago'         => 'nullable|date',
            'Observaciones'     => 'nullable|string',
        ]);

        $validated['CreadoPor'] = auth()->user()->getKey();

        $liquidacion = Liquidacion::create($validated);
        return response()->json($liquidacion, 201);
    }

    public function show($id)
    {
        $liquidacion = Liquidacion::findOrFail($id);
        return response()->json($liquidacion);
    }

    public function update(Request $request, $id)
    {
        $liquidacion = Liquidacion::findOrFail($id);

        $validated = $request->validate([
            'NumeroLiquidacion' => 'sometimes|string|unique:Liquidaciones,NumeroLiquidacion,' . $id . ',Id',
            'FechaLiquidacion'  => 'nullable|date',
            'BeneficioId'       => 'nullable|uuid',
            'ProveedorId'       => 'nullable|uuid',
            'TotalAnimales'     => 'nullable|integer|min:0',
            'PesoTotalKg'       => 'nullable|numeric|min:0',
            'PrecioKg'          => 'nullable|numeric|min:0',
            'ValorBruto'        => 'nullable|numeric|min:0',
            'Deducciones'       => 'nullable|numeric|min:0',
            'ValorNeto'         => 'nullable|numeric|min:0',
            'Estado'            => 'nullable|in:Pendiente,Aprobada,Pagada',
            'FechaPago'         => 'nullable|date',
            'Observaciones'     => 'nullable|string',
        ]);

        $liquidacion->update($validated);
        return response()->json($liquidacion);
    }

    public function destroy($id)
    {
        $liquidacion = Liquidacion::findOrFail($id);
        $liquidacion->update(['Eliminado' => true]);
        return response()->json(['message' => 'Liquidación eliminada']);
    }

    public function aprobar($id)
    {
        $liquidacion = Liquidacion::findOrFail($id);
        $liquidacion->update(['Estado' => 'Aprobada']);
        return response()->json($liquidacion);
    }

    public function marcarPagada($id)
    {
        $liquidacion = Liquidacion::findOrFail($id);
        $liquidacion->update([
            'Estado'    => 'Pagada',
            'FechaPago' => now(),
        ]);
        return response()->json($liquidacion);
    }
}
