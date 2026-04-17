<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KitServiceItem extends Model
{
    use HasFactory;

    protected $table = 'kit_service_items';

    public $timestamps = false;

    protected $fillable = [
        'kit_service_id',
        'articulo_id',
        'lista_precio',
        'cantidad',
        'precio_unitario',
        'tiempo_minutos',
        'tipo',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'decimal:2',
            'precio_unitario' => 'decimal:2',
            'tiempo_minutos' => 'integer',
        ];
    }

    // Relations

    public function kitService(): BelongsTo
    {
        return $this->belongsTo(KitService::class);
    }

    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class);
    }

    // Accessors

    public function getSubtotalAttribute(): float
    {
        return (float) ($this->cantidad * $this->precio_unitario);
    }
}
