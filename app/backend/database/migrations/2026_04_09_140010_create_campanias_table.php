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
        Schema::create('campanias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas');
            $table->string('registro_campania', 20);
            $table->string('tipo_campania', 50);
            $table->date('fecha');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->text('comentario')->nullable();
            $table->string('codigo_fabrica', 20)->nullable();
            $table->string('nro_boletin', 20)->nullable();
            $table->integer('cantidad_vehiculos')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->index('registro_campania');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campanias');
    }
};
