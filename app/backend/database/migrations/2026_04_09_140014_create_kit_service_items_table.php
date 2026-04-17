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
        Schema::create('kit_service_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kit_service_id')->constrained('kits_service')->cascadeOnDelete();
            $table->foreignId('articulo_id')->constrained('articulos');
            $table->string('lista_precio', 50)->default('PRINCIPAL');
            $table->decimal('cantidad', 10, 2)->default(1);
            $table->decimal('precio_unitario', 12, 2)->default(0);
            $table->integer('tiempo_minutos')->default(0);
            $table->enum('tipo', ['producto', 'servicio', 'inspeccion'])->default('producto');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kit_service_items');
    }
};
