<?php
namespace App\Http\Controllers;

use App\Models\Insumo;
use Illuminate\Http\Request;

class InsumoController extends Controller
{
    public function index()
    {
        $insumos = Insumo::where('Eliminado', false)
            ->where('Activo', true)
            ->orderBy('Nombre')
            ->get();
        return response()->json($insumos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'          => 'required|string|max:255',
            'Codigo'          => 'nullable|string|unique:Insumos,Codigo',
            'Descripcion'     => 'nullable|string',
            'UnidadMedida'    => 'nullable|string|max:50',
            'StockActual'     => 'nullable|numeric|min:0',
            'StockMinimo'     => 'nullable|numeric|min:0',
            'PrecioUnitario'  => 'nullable|numeric|min:0',
            'ProveedorNombre' => 'nullable|string|max:255',
        ]);

        $insumo = Insumo::create($validated);
        return response()->json($insumo, 201);
    }

    public function show($id)
    {
        $insumo = Insumo::findOrFail($id);
        return response()->json($insumo);
    }

    public function update(Request $request, $id)
    {
        $insumo = Insumo::findOrFail($id);

        $validated = $request->validate([
            'Nombre'          => 'sometimes|string|max:255',
            'Codigo'          => 'nullable|string|unique:Insumos,Codigo,' . $id . ',Id',
            'Descripcion'     => 'nullable|string',
            'UnidadMedida'    => 'nullable|string|max:50',
            'StockActual'     => 'nullable|numeric|min:0',
            'StockMinimo'     => 'nullable|numeric|min:0',
            'PrecioUnitario'  => 'nullable|numeric|min:0',
            'ProveedorNombre' => 'nullable|string|max:255',
            'Activo'          => 'nullable|boolean',
        ]);

        $insumo->update($validated);
        return response()->json($insumo);
    }

    public function destroy($id)
    {
        $insumo = Insumo::findOrFail($id);
        $insumo->update(['Activo' => false]);
        return response()->json(['message' => 'Insumo desactivado']);
    }
}
