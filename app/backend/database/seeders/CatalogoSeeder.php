<?php

namespace Database\Seeders;

use App\Models\Marca;
use App\Models\Modelo;
use App\Models\TipoCombustible;
use App\Models\TipoTransmision;
use Illuminate\Database\Seeder;

class CatalogoSeeder extends Seeder
{
    public function run(): void
    {
        $honda = Marca::create(['nombre' => 'Honda']);

        $modelos = ['CR-V', 'Accord', 'Civic', 'Pilot', 'HR-V', 'Fit', 'Odyssey'];
        foreach ($modelos as $modelo) {
            Modelo::create([
                'marca_id' => $honda->id,
                'nombre' => $modelo,
            ]);
        }

        $transmisiones = [
            ['codigo' => 'XAT', 'descripcion' => 'Automática XAT'],
            ['codigo' => 'CVT', 'descripcion' => 'Continuamente Variable CVT'],
            ['codigo' => 'MT', 'descripcion' => 'Manual'],
        ];
        foreach ($transmisiones as $t) {
            TipoTransmision::create($t);
        }

        $combustibles = [
            ['codigo' => 'NAFT', 'descripcion' => 'Naftero'],
            ['codigo' => 'DIES', 'descripcion' => 'Diésel'],
            ['codigo' => 'HYB', 'descripcion' => 'Híbrido'],
        ];
        foreach ($combustibles as $c) {
            TipoCombustible::create($c);
        }
    }
}
