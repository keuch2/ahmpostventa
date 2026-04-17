<?php

namespace Database\Seeders;

use App\Models\Articulo;
use App\Models\KitService;
use App\Models\KitServiceItem;
use Illuminate\Database\Seeder;

class KitServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Kit 5000 km for CR-V
        $kit5k = KitService::create([
            'empresa_id' => 1,
            'codigo_combo' => 'AC-CV265-005',
            'modelo_id' => 1,
            'anio_inicio' => 2018,
            'anio_final' => 2022,
            'kilometraje' => 5000,
            'descripcion' => 'MANTENIMIENTO 5.000 KM',
            'express' => false,
            'activo' => true,
        ]);

        $aceite = Articulo::where('codigo', 'HMJA08798-9261')->first();
        $filtro = Articulo::where('codigo', 'HMJA15400PLM')->first();
        $servCambio = Articulo::where('codigo', 'HMJASERV2')->first();
        $inspNiveles = Articulo::where('codigo', 'HMJAINSP2')->first();

        KitServiceItem::create([
            'kit_service_id' => $kit5k->id,
            'articulo_id' => $aceite->id,
            'cantidad' => 4,
            'precio_unitario' => $aceite->precio,
            'tipo' => 'producto',
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit5k->id,
            'articulo_id' => $filtro->id,
            'cantidad' => 1,
            'precio_unitario' => $filtro->precio,
            'tipo' => 'producto',
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit5k->id,
            'articulo_id' => $servCambio->id,
            'cantidad' => 1,
            'precio_unitario' => $servCambio->precio,
            'tipo' => 'servicio',
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit5k->id,
            'articulo_id' => $inspNiveles->id,
            'cantidad' => 1,
            'precio_unitario' => $inspNiveles->precio,
            'tipo' => 'inspeccion',
        ]);

        // Kit 50000 km for CR-V
        $kit50k = KitService::create([
            'empresa_id' => 1,
            'codigo_combo' => 'AC-CV265-050',
            'modelo_id' => 1,
            'anio_inicio' => 2018,
            'anio_final' => 2022,
            'kilometraje' => 50000,
            'descripcion' => 'MANTENIMIENTO 50.000 KM',
            'express' => false,
            'activo' => true,
        ]);

        $aditivo = Articulo::where('codigo', 'HMJA0200P93G8YD1')->first();
        $solucion = Articulo::where('codigo', 'HMJA08798TABS')->first();
        $arandela = Articulo::where('codigo', 'HMJA9410914000')->first();
        $agua = Articulo::where('codigo', 'HMPADESTILADA')->first();
        $servMant = Articulo::where('codigo', 'HMJASERV1')->first();
        $inspFreno = Articulo::where('codigo', 'HMJAINSP1')->first();

        KitServiceItem::create([
            'kit_service_id' => $kit50k->id,
            'articulo_id' => $aceite->id,
            'cantidad' => 4,
            'precio_unitario' => 105000,
            'tipo' => 'producto',
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit50k->id,
            'articulo_id' => $aditivo->id,
            'cantidad' => 1,
            'precio_unitario' => 180000,
            'tipo' => 'producto',
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit50k->id,
            'articulo_id' => $solucion->id,
            'cantidad' => 1,
            'precio_unitario' => 10000,
            'tipo' => 'producto',
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit50k->id,
            'articulo_id' => $arandela->id,
            'cantidad' => 1,
            'precio_unitario' => 4000,
            'tipo' => 'producto',
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit50k->id,
            'articulo_id' => $agua->id,
            'cantidad' => 2,
            'precio_unitario' => 4000,
            'tipo' => 'producto',
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit50k->id,
            'articulo_id' => $filtro->id,
            'cantidad' => 1,
            'precio_unitario' => 45000,
            'tipo' => 'producto',
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit50k->id,
            'articulo_id' => $servMant->id,
            'cantidad' => 1,
            'precio_unitario' => 150000,
            'tipo' => 'servicio',
            'tiempo_minutos' => 100,
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit50k->id,
            'articulo_id' => $inspFreno->id,
            'cantidad' => 1,
            'precio_unitario' => 0,
            'tipo' => 'inspeccion',
            'tiempo_minutos' => 30,
        ]);

        KitServiceItem::create([
            'kit_service_id' => $kit50k->id,
            'articulo_id' => $inspNiveles->id,
            'cantidad' => 1,
            'precio_unitario' => 0,
            'tipo' => 'inspeccion',
            'tiempo_minutos' => 15,
        ]);
    }
}
