<?php

namespace Database\Seeders;

use App\Models\Empresa;
use Illuminate\Database\Seeder;

class EmpresaSeeder extends Seeder
{
    public function run(): void
    {
        Empresa::create([
            'razon_social' => 'VICAR S.A.',
            'ruc' => '80012345-1',
            'telefono' => '(021) 600-1234',
            'email' => 'info@vicar.com.py',
            'activo' => true,
        ]);
    }
}
