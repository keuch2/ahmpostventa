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
        Schema::create('citas_servicio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas');
            $table->foreignId('cliente_id')->constrained('clientes');
            $table->foreignId('vehiculo_id')->constrained('vehiculos');
            $table->foreignId('kit_service_id')->nullable()->constrained('kits_service')->nullOnDelete();
            $table->foreignId('campania_vehiculo_id')->nullable()->constrained('campania_vehiculos')->nullOnDelete();
            $table->dateTime('fecha_solicitada');
            $table->dateTime('fecha_confirmada')->nullable();
            $table->string('tipo_servicio', 100);
            $table->unsignedInteger('kilometraje')->nullable();
            $table->text('comentarios')->nullable();
            $table->enum('estado', ['solicitada', 'confirmada', 'en_proceso', 'completada', 'cancelada'])->default('solicitada');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citas_servicio');
    }
};
