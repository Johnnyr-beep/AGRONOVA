<?php
namespace App\Http\Controllers;

use App\Models\Insumo;
use App\Models\Movimiento;
use Illuminate\Http\Request;

class MovimientoController extends Controller
{
    public function index()
    {
        $movimientos = Movimiento::with('insumo')
            ->orderBy('created_at', 'desc')
            ->paginate(50);
        return response()->json($movimientos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Tipo'       => 'required|in:Entrada,Salida,Ajuste',
            'InsumoId'   => 'required|uuid',
            'Cantidad'   => 'required|numeric|min:0.001',
            'Referencia' => 'nullable|string|max:255',
            'Motivo'     => 'nullable|string',
        ]);

        $insumo = Insumo::findOrFail($validated['InsumoId']);
        $stockAnterior = (float) $insumo->getAttribute('StockActual');
        $cantidad = (float) $validated['Cantidad'];

        if ($validated['Tipo'] === 'Entrada') {
            $stockResultante = $stockAnterior + $cantidad;
        } elseif ($validated['Tipo'] === 'Salida') {
            $stockResultante = $stockAnterior - $cantidad;
            if ($stockResultante < 0) {
                return response()->json(['message' => 'Stock insuficiente'], 422);
            }
        } else {
            $stockResultante = $cantidad;
        }

        $insumo->update(['StockActual' => $stockResultante]);

        $movimiento = Movimiento::create([
            'Tipo'             => $validated['Tipo'],
            'InsumoId'         => $validated['InsumoId'],
            'Cantidad'         => $cantidad,
            'StockAnterior'    => $stockAnterior,
            'StockResultante'  => $stockResultante,
            'FechaMovimiento'  => now(),
            'Referencia'       => $validated['Referencia'] ?? null,
            'Motivo'           => $validated['Motivo'] ?? null,
            'OperarioId'       => auth()->user()->getKey(),
        ]);

        return response()->json($movimiento->load('insumo'), 201);
    }
}
