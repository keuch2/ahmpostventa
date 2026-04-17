<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaniaVehiculo extends Model
{
    use HasFactory;

    protected $table = 'campania_vehiculos';

    protected $fillable = [
        'campania_id',
        'vehiculo_id',
        'fecha_venta',
        'numero_ot',
        'estado',
        'fecha_realizacion',
        'fecha_facturacion',
        'monto_facturado',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'fecha_venta' => 'date',
            'fecha_realizacion' => 'date',
            'fecha_facturacion' => 'date',
            'monto_facturado' => 'decimal:2',
        ];
    }

    // Relations

    public function campania(): BelongsTo
    {
        return $this->belongsTo(Campania::class);
    }

    public function vehiculo(): BelongsTo
    {
        return $this->belongsTo(Vehiculo::class);
    }
}
