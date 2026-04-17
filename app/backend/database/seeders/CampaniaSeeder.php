<?php

namespace Database\Seeders;

use App\Models\Campania;
use App\Models\CampaniaVehiculo;
use Illuminate\Database\Seeder;

class CampaniaSeeder extends Seeder
{
    public function run(): void
    {
        $c1 = Campania::create([
            'empresa_id' => 1,
            'registro_campania' => 'SYP1',
            'tipo_campania' => 'RECALL 01',
            'fecha' => '2025-04-07',
            'comentario' => 'COMPONENTE DE SOLENOIDE DE LA BOMBA DE ALTA PRESIÓN DAÑADO',
            'codigo_fabrica' => 'SYP',
            'nro_boletin' => '0808/25',
            'cantidad_vehiculos' => 1,
            'activo' => true,
        ]);

        CampaniaVehiculo::create([
            'campania_id' => $c1->id,
            'vehiculo_id' => 1,
            'estado' => 'pendiente',
        ]);

        $c2 = Campania::create([
            'empresa_id' => 1,
            'registro_campania' => 'TKT1',
            'tipo_campania' => 'RECALL 02',
            'fecha' => '2024-11-15',
            'comentario' => 'INFLADOR AIRBAG CONDUCTOR (TAKATA) - REEMPLAZO PREVENTIVO',
            'codigo_fabrica' => 'TAKATA-01',
            'nro_boletin' => '0612/24',
            'cantidad_vehiculos' => 1,
            'activo' => true,
        ]);

        CampaniaVehiculo::create([
            'campania_id' => $c2->id,
            'vehiculo_id' => 1,
            'estado' => 'pendiente',
        ]);

        $c3 = Campania::create([
            'empresa_id' => 1,
            'registro_campania' => 'ABS1',
            'tipo_campania' => 'RECALL 03',
            'fecha' => '2025-01-20',
            'comentario' => 'ACTUALIZACIÓN SOFTWARE FRENOS ABS',
            'codigo_fabrica' => 'ABS-SW',
            'nro_boletin' => '0215/25',
            'cantidad_vehiculos' => 1,
            'activo' => true,
        ]);

        CampaniaVehiculo::create([
            'campania_id' => $c3->id,
            'vehiculo_id' => 1,
            'estado' => 'realizado',
            'numero_ot' => '1019067',
            'fecha_realizacion' => '2025-06-12',
        ]);
    }
}
