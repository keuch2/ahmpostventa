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
        Schema::create('campania_vehiculos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campania_id')->constrained('campanias')->cascadeOnDelete();
            $table->foreignId('vehiculo_id')->constrained('vehiculos');
            $table->date('fecha_venta')->nullable();
            $table->string('numero_ot', 20)->nullable();
            $table->enum('estado', ['pendiente', 'en_proceso', 'realizado', 'facturado'])->default('pendiente');
            $table->date('fecha_realizacion')->nullable();
            $table->date('fecha_facturacion')->nullable();
            $table->decimal('monto_facturado', 12, 2)->default(0);
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->unique(['campania_id', 'vehiculo_id']);
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campania_vehiculos');
    }
};
