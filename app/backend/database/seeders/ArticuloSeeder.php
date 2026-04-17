<?php

namespace Database\Seeders;

use App\Models\Articulo;
use Illuminate\Database\Seeder;

class ArticuloSeeder extends Seeder
{
    public function run(): void
    {
        $articulos = [
            ['codigo' => 'HMJA08798-9261', 'descripcion' => 'Aceite motor 0W-20 SP/GF6A HELIX ULTRA 4L', 'tipo' => 'repuesto', 'precio' => 105000],
            ['codigo' => 'HMJA0200P93G8YD1', 'descripcion' => 'Aditivo limpieza sistema combustible', 'tipo' => 'repuesto', 'precio' => 180000],
            ['codigo' => 'HMJA08798TABS', 'descripcion' => 'Solución acuosa limpieza parabrisas', 'tipo' => 'repuesto', 'precio' => 10000],
            ['codigo' => 'HMJA9410914000', 'descripcion' => 'Arandela tapón cárter', 'tipo' => 'repuesto', 'precio' => 4000],
            ['codigo' => 'HMPADESTILADA', 'descripcion' => 'Agua destilada 1L', 'tipo' => 'repuesto', 'precio' => 4000],
            ['codigo' => 'HMJA15400PLM', 'descripcion' => 'Filtro de aceite genuino Honda', 'tipo' => 'repuesto', 'precio' => 45000],
            ['codigo' => 'HMJASERV1', 'descripcion' => 'Servicio Mantenimiento Preventivo General', 'tipo' => 'servicio', 'precio' => 150000],
            ['codigo' => 'HMJASERV2', 'descripcion' => 'Servicio Cambio de Aceite Express', 'tipo' => 'servicio', 'precio' => 80000],
            ['codigo' => 'HMJAINSP1', 'descripcion' => 'Inspección visual frenos y suspensión', 'tipo' => 'inspeccion', 'precio' => 0],
            ['codigo' => 'HMJAINSP2', 'descripcion' => 'Inspección niveles fluidos', 'tipo' => 'inspeccion', 'precio' => 0],
        ];

        foreach ($articulos as $articulo) {
            Articulo::create(array_merge($articulo, ['empresa_id' => 1]));
        }
    }
}
