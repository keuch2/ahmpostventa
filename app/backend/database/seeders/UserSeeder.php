<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nombre' => 'Super Admin',
            'email' => 'superadmin@vicar.com.py',
            'password' => Hash::make('SuperAdmin123!'),
            'role' => 'superadmin',
            'empresa_id' => 1,
            'activo' => true,
        ]);

        User::create([
            'nombre' => 'Administrador VICAR',
            'email' => 'admin@vicar.com.py',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
            'empresa_id' => 1,
            'activo' => true,
        ]);

        User::create([
            'nombre' => 'José Agüero',
            'email' => 'cliente@test.com',
            'password' => Hash::make('Cliente123!'),
            'role' => 'cliente',
            'activo' => true,
        ]);
    }
}
