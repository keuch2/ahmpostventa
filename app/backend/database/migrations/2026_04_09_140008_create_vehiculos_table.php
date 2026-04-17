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
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas');
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->nullOnDelete();
            $table->string('nro_chassis', 50)->unique();
            $table->string('matricula', 20)->nullable();
            $table->foreignId('modelo_id')->constrained('modelos');
            $table->smallInteger('anio')->unsigned();
            $table->string('carroceria', 50)->nullable();
            $table->string('color', 50)->nullable();
            $table->string('vds', 20)->nullable();
            $table->foreignId('transmision_id')->nullable()->constrained('tipo_transmision')->nullOnDelete();
            $table->foreignId('combustible_id')->nullable()->constrained('tipo_combustible')->nullOnDelete();
            $table->unsignedInteger('kilometraje_actual')->default(0);
            $table->date('fecha_venta')->nullable();
            $table->string('imagen_url', 500)->nullable();
            $table->timestamps();

            $table->index('nro_chassis');
            $table->index('matricula');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};
