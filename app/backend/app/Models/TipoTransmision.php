<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoTransmision extends Model
{
    use HasFactory;

    protected $table = 'tipo_transmision';

    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'descripcion',
    ];
}
