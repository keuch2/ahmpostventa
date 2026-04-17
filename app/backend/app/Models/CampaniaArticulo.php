<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaniaArticulo extends Model
{
    use HasFactory;

    protected $table = 'campania_articulos';

    public $timestamps = false;

    protected $fillable = [
        'campania_id',
        'articulo_id',
        'cantidad',
        'precio',
        'tipo',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'decimal:2',
            'precio' => 'decimal:2',
        ];
    }

    // Relations

    public function campania(): BelongsTo
    {
        return $this->belongsTo(Campania::class);
    }

    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class);
    }
}
