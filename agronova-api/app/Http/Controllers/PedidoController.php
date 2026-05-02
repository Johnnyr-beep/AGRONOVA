<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    public function index()
    {
        return Pedido::where('Eliminado', false)->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroPedido'  => 'required|string|max:50|unique:Pedidos,NumeroPedido',
            'FechaPedido'   => 'nullable|date',
            'ClienteId'     => 'nullable|uuid',
            'ClienteNombre' => 'nullable|string|max:200',
            'PesoTotalKg'   => 'nullable|numeric|min:0',
            'MontoTotal'    => 'nullable|numeric|min:0',
            'Estado'        => 'nullable|string|max:50',
            'Observaciones' => 'nullable|string',
        ]);
        $validated['CreadoPor'] = auth()->user()->getKey();
        return response()->json(Pedido::create($validated), 201);
    }

    public function show($id)
    {
        return Pedido::where('Id', $id)->where('Eliminado', false)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $item = Pedido::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $validated = $request->validate([
            'NumeroPedido'  => 'sometimes|required|string|max:50|unique:Pedidos,NumeroPedido,' . $id . ',Id',
            'FechaPedido'   => 'nullable|date',
            'ClienteId'     => 'nullable|uuid',
            'ClienteNombre' => 'nullable|string|max:200',
            'PesoTotalKg'   => 'nullable|numeric|min:0',
            'MontoTotal'    => 'nullable|numeric|min:0',
            'Estado'        => 'nullable|string|max:50',
            'Observaciones' => 'nullable|string',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Pedido::where('Id', $id)->where('Eliminado', false)->firstOrFail();
        $item->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }
}
