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
            'Nombre' => 'required',
            'NombreUsuario' => 'required|unique:Usuarios',
            'PasswordHash' => 'required',
            'Email' => 'nullable|email',
        ]);

        $validated['PasswordHash'] = bcrypt($validated['PasswordHash']);
        $validated['Activo'] = true;
        $validated['Eliminado'] = false;

        $user = User::create($validated);

        return response()->json($user, 201);
    }
}
