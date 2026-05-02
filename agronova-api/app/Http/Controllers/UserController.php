<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::where('Eliminado', false)
            ->orderBy('Nombre', 'asc')
            ->get();
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'        => 'required|string|max:100',
            'Apellido'      => 'nullable|string|max:100',
            'NombreUsuario' => 'required|unique:Usuarios,NombreUsuario',
            'PasswordHash'  => 'required|string|min:6',
            'Email'         => 'nullable|email|unique:Usuarios,Email',
            'Cedula'        => 'nullable|string|max:20',
            'Telefono'      => 'nullable|string|max:30',
            'TipoEmpleado'  => 'nullable|string|max:50',
            'FechaIngreso'  => 'nullable|date',
        ]);

        // Model's 'hashed' cast handles bcrypt — no manual bcrypt needed
        $validated['Activo'] = true;
        $validated['Eliminado'] = false;

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'Nombre'        => 'sometimes|required|string|max:100',
            'Apellido'      => 'nullable|string|max:100',
            'NombreUsuario' => 'sometimes|required|unique:Usuarios,NombreUsuario,' . $id . ',Id',
            'Email'         => 'nullable|email|unique:Usuarios,Email,' . $id . ',Id',
            'Cedula'        => 'nullable|string|max:20',
            'Telefono'      => 'nullable|string|max:30',
            'TipoEmpleado'  => 'nullable|string|max:50',
            'FechaIngreso'  => 'nullable|date',
            'Activo'        => 'boolean',
        ]);

        $user->update($validated);
        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->update(['Eliminado' => true]);
        return response()->json(null, 204);
    }

    public function cambiarPassword(Request $request, $id)
    {
        $request->validate(['NuevaPassword' => 'required|string|min:6']);
        $user = User::findOrFail($id);
        // Model's 'hashed' cast auto-hashes on assignment
        $user->PasswordHash = $request->input('NuevaPassword');
        $user->save();
        return response()->json(['message' => 'Contraseña actualizada']);
    }
}
