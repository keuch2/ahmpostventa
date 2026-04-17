<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        Cliente::create([
            'empresa_id' => 1,
            'user_id' => 3,
            'codigo_cliente' => 'CLI-0001',
            'razon_social' => 'José Agüero',
            'ruc_ci' => '4.567.890-1',
            'telefono' => '(021) 555-1234',
            'celular' => '0981 123 456',
            'email' => 'cliente@test.com',
            'direccion' => 'Avda. Mariscal López 1234, Asunción',
        ]);
    }
}
