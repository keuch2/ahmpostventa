<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CitaServicio extends Model
{
    use HasFactory;

    protected $table = 'citas_servicio';

    protected $fillable = [
        'empresa_id',
        'cliente_id',
        'vehiculo_id',
        'kit_service_id',
        'campania_vehiculo_id',
        'fecha_solicitada',
        'fecha_confirmada',
        'tipo_servicio',
        'kilometraje',
        'comentarios',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_solicitada' => 'datetime',
            'fecha_confirmada' => 'datetime',
            'kilometraje' => 'integer',
        ];
    }

    // Relations

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function vehiculo(): BelongsTo
    {
        return $this->belongsTo(Vehiculo::class);
    }

    public function kitService(): BelongsTo
    {
        return $this->belongsTo(KitService::class);
    }

    public function campaniaVehiculo(): BelongsTo
    {
        return $this->belongsTo(CampaniaVehiculo::class);
    }
}
