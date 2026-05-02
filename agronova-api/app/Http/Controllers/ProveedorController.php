<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    public function index()
    {
        return Proveedor::where('Eliminado', false)
            ->orderBy('Nombre', 'asc')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'      => 'required|string',
            'RazonSocial' => 'nullable|string',
            'NIT'         => 'nullable|string|unique:Proveedores',
            'Telefono'    => 'nullable|string',
            'Email'       => 'nullable|email',
            'Direccion'   => 'nullable|string',
            'Ciudad'      => 'nullable|string',
            'Contacto'    => 'nullable|string',
            'Observaciones' => 'nullable|string',
        ]);

        $validated['Activo']   = true;
        $validated['Eliminado'] = false;

        return response()->json(Proveedor::create($validated), 201);
    }

    public function show($id)
    {
        return response()->json(Proveedor::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $proveedor = Proveedor::findOrFail($id);

        $validated = $request->validate([
            'Nombre'      => 'nullable|string',
            'RazonSocial' => 'nullable|string',
            'NIT'         => "nullable|string|unique:Proveedores,NIT,{$id}",
            'Telefono'    => 'nullable|string',
            'Email'       => 'nullable|email',
            'Direccion'   => 'nullable|string',
            'Ciudad'      => 'nullable|string',
            'Contacto'    => 'nullable|string',
            'Observaciones' => 'nullable|string',
            'Activo'      => 'nullable|boolean',
        ]);

        $proveedor->update($validated);

        return response()->json($proveedor);
    }

    public function destroy($id)
    {
        $proveedor = Proveedor::findOrFail($id);
        $proveedor->update(['Eliminado' => true]);

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

        return Proveedor::where('Eliminado', false)
            ->where($field, 'like', "%{$term}%")
            ->distinct()
            ->orderBy($field)
            ->limit(10)
            ->pluck($field);
    }
}
