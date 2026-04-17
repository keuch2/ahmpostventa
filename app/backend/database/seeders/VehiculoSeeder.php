<?php

namespace Database\Seeders;

use App\Models\Vehiculo;
use Illuminate\Database\Seeder;

class VehiculoSeeder extends Seeder
{
    public function run(): void
    {
        Vehiculo::create([
            'empresa_id' => 1,
            'cliente_id' => 1,
            'nro_chassis' => '2HKRW2H8XJH123456',
            'matricula' => 'ABC-123',
            'modelo_id' => 1,
            'anio' => 2018,
            'carroceria' => 'AWD EX w/Leather CVT',
            'color' => 'Blanco Platino',
            'vds' => 'RW2H8',
            'transmision_id' => 2,
            'combustible_id' => 1,
            'kilometraje_actual' => 45000,
            'fecha_venta' => '2018-06-15',
        ]);

        Vehiculo::create([
            'empresa_id' => 1,
            'cliente_id' => 1,
            'nro_chassis' => '1HGCV1F34JA000789',
            'matricula' => 'DEF-456',
            'modelo_id' => 3,
            'anio' => 2020,
            'carroceria' => 'Sedan EX-L CVT',
            'color' => 'Negro Cristal',
            'vds' => 'CV1F3',
            'transmision_id' => 2,
            'combustible_id' => 1,
            'kilometraje_actual' => 28000,
            'fecha_venta' => '2020-03-10',
        ]);
    }
}
