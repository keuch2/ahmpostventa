<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KitService extends Model
{
    use HasFactory;

    protected $table = 'kits_service';

    protected $fillable = [
        'empresa_id',
        'codigo_combo',
        'modelo_id',
        'codigo_grado',
        'vds',
        'anio_inicio',
        'anio_final',
        'carroceria',
        'transmision_id',
        'combustible_id',
        'tipo_motor',
        'kilometraje',
        'descripcion',
        'express',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'express' => 'boolean',
            'activo' => 'boolean',
            'anio_inicio' => 'integer',
            'anio_final' => 'integer',
            'kilometraje' => 'integer',
        ];
    }

    // Relations

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    public function modelo(): BelongsTo
    {
        return $this->belongsTo(Modelo::class);
    }

    public function transmision(): BelongsTo
    {
        return $this->belongsTo(TipoTransmision::class, 'transmision_id');
    }

    public function combustible(): BelongsTo
    {
        return $this->belongsTo(TipoCombustible::class, 'combustible_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(KitServiceItem::class);
    }

    // Scopes

    public function scopeActivo(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    public function scopePorEmpresa(Builder $query, int $id): Builder
    {
        return $query->where('empresa_id', $id);
    }

    // Accessors

    public function getTotalProductosAttribute(): float
    {
        return (float) $this->items()
            ->where('tipo', 'producto')
            ->selectRaw('SUM(cantidad * precio_unitario) as total')
            ->value('total') ?? 0;
    }

    public function getTotalServiciosAttribute(): float
    {
        return (float) $this->items()
            ->where('tipo', 'servicio')
            ->selectRaw('SUM(cantidad * precio_unitario) as total')
            ->value('total') ?? 0;
    }

    public function getTotalAttribute(): float
    {
        return $this->total_productos + $this->total_servicios;
    }
}
