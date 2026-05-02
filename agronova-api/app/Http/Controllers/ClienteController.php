<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        return Cliente::where('Eliminado', false)
            ->orderBy('Nombre', 'asc')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'      => 'required|string',
            'RazonSocial' => 'nullable|string',
            'NIT'         => 'nullable|string|unique:Clientes',
            'Telefono'    => 'nullable|string',
            'Email'       => 'nullable|email',
            'Direccion'   => 'nullable|string',
            'Ciudad'      => 'nullable|string',
            'Contacto'    => 'nullable|string',
            'Observaciones' => 'nullable|string',
        ]);

        $validated['Activo']   = true;
        $validated['Eliminado'] = false;

        return response()->json(Cliente::create($validated), 201);
    }

    public function show($id)
    {
        return response()->json(Cliente::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);

        $validated = $request->validate([
            'Nombre'      => 'nullable|string',
            'RazonSocial' => 'nullable|string',
            'NIT'         => "nullable|string|unique:Clientes,NIT,{$id}",
            'Telefono'    => 'nullable|string',
            'Email'       => 'nullable|email',
            'Direccion'   => 'nullable|string',
            'Ciudad'      => 'nullable|string',
            'Contacto'    => 'nullable|string',
            'Observaciones' => 'nullable|string',
            'Activo'      => 'nullable|boolean',
        ]);

        $cliente->update($validated);

        return response()->json($cliente);
    }

    public function destroy($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update(['Eliminado' => true]);

        return response()->json(null, 204);
    }

    public function suggestions(Request $request)
    {
        $field   = $request->input('field');
        $allowed = ['Nombre', 'RazonSocial', 'NIT', 'Ciudad'];
        if (!\in_array($field, $allowed, true)) {
            return response()->json([], 400);
        }

        $term = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], (string) $request->input('query', ''));

        return Cliente::where('Eliminado', false)
            ->where($field, 'like', "%{$term}%")
            ->distinct()
            ->orderBy($field)
            ->limit(10)
            ->pluck($field);
    }
}
