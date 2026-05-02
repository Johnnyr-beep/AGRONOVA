<?php
namespace App\Http\Controllers;

use App\Models\Devolucion;
use Illuminate\Http\Request;

class DevolucionController extends Controller
{
    public function index()
    {
        $devoluciones = Devolucion::where('Eliminado', false)
            ->orderBy('created_at', 'desc')
            ->paginate(50);
        return response()->json($devoluciones);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'NumeroDevolucion' => 'required|string|unique:Devoluciones,NumeroDevolucion',
            'FechaDevolucion'  => 'nullable|date',
            'DespachoId'       => 'nullable|uuid',
            'ClienteId'        => 'nullable|uuid',
            'MotivoDevolucion' => 'nullable|string',
            'PesoDevueltoKg'   => 'nullable|numeric|min:0',
            'MontoDevolucion'  => 'nullable|numeric|min:0',
            'Estado'           => 'nullable|in:Pendiente,Aprobada,Rechazada',
            'Observaciones'    => 'nullable|string',
        ]);

        $validated['CreadoPor'] = auth()->user()->getKey();

        $devolucion = Devolucion::create($validated);
        return response()->json($devolucion, 201);
    }

    public function show($id)
    {
        $devolucion = Devolucion::findOrFail($id);
        return response()->json($devolucion);
    }

    public function update(Request $request, $id)
    {
        $devolucion = Devolucion::findOrFail($id);

        $validated = $request->validate([
            'NumeroDevolucion' => 'sometimes|string|unique:Devoluciones,NumeroDevolucion,' . $id . ',Id',
            'FechaDevolucion'  => 'nullable|date',
            'DespachoId'       => 'nullable|uuid',
            'ClienteId'        => 'nullable|uuid',
            'MotivoDevolucion' => 'nullable|string',
            'PesoDevueltoKg'   => 'nullable|numeric|min:0',
            'MontoDevolucion'  => 'nullable|numeric|min:0',
            'Estado'           => 'nullable|in:Pendiente,Aprobada,Rechazada',
            'Observaciones'    => 'nullable|string',
        ]);

        $devolucion->update($validated);
        return response()->json($devolucion);
    }

    public function destroy($id)
    {
        $devolucion = Devolucion::findOrFail($id);
        $devolucion->update(['Eliminado' => true]);
        return response()->json(['message' => 'Devolución eliminada']);
    }

    public function aprobar($id)
    {
        $devolucion = Devolucion::findOrFail($id);
        $devolucion->update([
            'Estado'         => 'Aprobada',
            'AprobadoPorId'  => auth()->user()->getKey(),
            'FechaAprobacion'=> now(),
        ]);
        return response()->json($devolucion);
    }
}
