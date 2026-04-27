<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['NombreUsuario' => 'admin'],
            [
                'Nombre' => 'Super',
                'Apellido' => 'Admin',
                'Email' => 'admin@agropecuaria.com',
                'PasswordHash' => Hash::make('admin123'),
                'Cedula' => '00000000',
                'Telefono' => '00000000',
                'TipoEmpleado' => 'ADMINISTRADOR',
                'FechaIngreso' => now(),
                'Activo' => true,
                'Eliminado' => false,
            ]
        );
    }
}
