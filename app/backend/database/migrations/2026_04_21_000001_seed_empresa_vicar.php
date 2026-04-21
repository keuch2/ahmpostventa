<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::table('empresas')->doesntExist()) {
            DB::table('empresas')->insert([
                'razon_social' => 'VICAR S.A.',
                'ruc'          => '80012345-1',
                'telefono'     => '(021) 600-1234',
                'email'        => 'info@vicar.com.py',
                'activo'       => true,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('empresas')->where('ruc', '80012345-1')->delete();
    }
};
