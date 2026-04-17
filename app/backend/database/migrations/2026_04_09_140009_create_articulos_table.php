<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articulos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas');
            $table->string('codigo', 50);
            $table->string('descripcion', 500);
            $table->string('cod_linea', 20)->nullable();
            $table->enum('tipo', ['repuesto', 'servicio', 'inspeccion'])->default('repuesto');
            $table->decimal('precio', 12, 2)->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->index('codigo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articulos');
    }
};
