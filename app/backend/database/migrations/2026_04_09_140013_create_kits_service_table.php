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
        Schema::create('kits_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas');
            $table->string('codigo_combo', 50);
            $table->foreignId('modelo_id')->constrained('modelos');
            $table->string('codigo_grado', 20)->nullable();
            $table->string('vds', 20)->nullable();
            $table->smallInteger('anio_inicio')->unsigned();
            $table->smallInteger('anio_final')->unsigned();
            $table->string('carroceria', 50)->nullable();
            $table->foreignId('transmision_id')->nullable()->constrained('tipo_transmision')->nullOnDelete();
            $table->foreignId('combustible_id')->nullable()->constrained('tipo_combustible')->nullOnDelete();
            $table->string('tipo_motor', 50)->nullable();
            $table->unsignedInteger('kilometraje');
            $table->string('descripcion', 500);
            $table->boolean('express')->default(false);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->index('codigo_combo');
            $table->index(['empresa_id', 'modelo_id', 'kilometraje']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kits_service');
    }
};
