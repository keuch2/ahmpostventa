<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Marca;
use App\Models\Modelo;
use App\Models\TipoCombustible;
use App\Models\TipoTransmision;

class CatalogoAdminController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $modelos = Modelo::with('marca')->orderBy('nombre')->get();
        $marcas = Marca::orderBy('nombre')->get();
        $transmisiones = TipoTransmision::orderBy('descripcion')->get();
        $combustibles = TipoCombustible::orderBy('descripcion')->get();

        return $this->success([
            'modelos'       => $modelos,
            'marcas'        => $marcas,
            'transmisiones' => $transmisiones,
            'combustibles'  => $combustibles,
        ]);
    }
}
