<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehiculo extends Model
{
    use HasFactory;

    protected $table = 'vehiculos';

    protected $fillable = [
        'empresa_id',
        'cliente_id',
        'nro_chassis',
        'matricula',
        'modelo_id',
        'anio',
        'carroceria',
        'color',
        'vds',
        'transmision_id',
        'combustible_id',
        'kilometraje_actual',
        'fecha_venta',
        'imagen_url',
    ];

    protected function casts(): array
    {
        return [
            'fecha_venta' => 'date',
            'kilometraje_actual' => 'integer',
            'anio' => 'integer',
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

    public function campaniaVehiculos(): HasMany
    {
        return $this->hasMany(CampaniaVehiculo::class);
    }

    public function citasServicio(): HasMany
    {
        return $this->hasMany(CitaServicio::class);
    }

    // Scopes

    public function scopePorEmpresa(Builder $query, int $id): Builder
    {
        return $query->where('empresa_id', $id);
    }
}
