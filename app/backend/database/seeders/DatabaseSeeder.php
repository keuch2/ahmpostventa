<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            EmpresaSeeder::class,
            UserSeeder::class,
            CatalogoSeeder::class,
            ClienteSeeder::class,
            VehiculoSeeder::class,
            ArticuloSeeder::class,
            CampaniaSeeder::class,
            KitServiceSeeder::class,
        ]);
    }
}
