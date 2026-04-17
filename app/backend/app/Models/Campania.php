<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campania extends Model
{
    use HasFactory;

    protected $table = 'campanias';

    protected $fillable = [
        'empresa_id',
        'registro_campania',
        'tipo_campania',
        'fecha',
        'fecha_inicio',
        'fecha_fin',
        'comentario',
        'codigo_fabrica',
        'nro_boletin',
        'cantidad_vehiculos',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'activo' => 'boolean',
        ];
    }

    // Relations

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    public function vehiculos(): HasMany
    {
        return $this->hasMany(CampaniaVehiculo::class);
    }

    public function articulos(): HasMany
    {
        return $this->hasMany(CampaniaArticulo::class);
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

    public function getCantidadPendientesAttribute(): int
    {
        return $this->vehiculos()->where('estado', 'pendiente')->count();
    }
}
