<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\CampaniaVehiculo;
use App\Models\KitService;
use App\Models\Modelo;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehiculoController extends Controller
{
    use ApiResponse;

    public function catalogo()
    {
        // Cargar todos los modelos que tienen vehículos con su marca
        $modelos = Modelo::whereHas('vehiculos')
            ->with('marca')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'nombre' => $m->nombre,
                'marca' => $m->marca->nombre,
            ]);

        // Cargar todas las combinaciones (anio, modelo_id, carroceria) existentes
        // para poder hacer filtrado en cascada en el frontend
        $combinaciones = Vehiculo::select('anio', 'modelo_id', 'carroceria')
            ->distinct()
            ->orderBy('anio', 'desc')
            ->get()
            ->map(fn ($v) => [
                'anio' => $v->anio,
                'modelo_id' => $v->modelo_id,
                'carroceria' => $v->carroceria,
            ]);

        return $this->success([
            'modelos' => $modelos,
            'combinaciones' => $combinaciones,
        ]);
    }

    public function buscarPorModelo(Request $request)
    {
        $query = Vehiculo::with(['modelo.marca', 'transmision', 'combustible']);

        if ($request->query('anio')) {
            $query->where('anio', $request->query('anio'));
        }
        if ($request->query('modelo_id')) {
            $query->where('modelo_id', $request->query('modelo_id'));
        }
        if ($request->query('carroceria')) {
            $query->where('carroceria', 'LIKE', '%' . $request->query('carroceria') . '%');
        }

        $vehiculos = $query->limit(20)->get();

        return $this->success($vehiculos);
    }

    public function buscar(Request $request)
    {
        $vin = $request->query('vin');

        if (!$vin) {
            return $this->error('El parámetro vin es requerido.', [], 400);
        }

        $query = Vehiculo::where('nro_chassis', 'LIKE', "%{$vin}%")
            ->with(['modelo.marca', 'transmision', 'combustible']);

        if ($request->user()) {
            $query->with('cliente');
        }

        $vehiculo = $query->first();

        if (!$vehiculo) {
            return $this->error('Vehículo no encontrado.', [], 404);
        }

        return $this->success($vehiculo);
    }

    public function show($id)
    {
        $vehiculo = Vehiculo::with(['modelo.marca', 'transmision', 'combustible', 'cliente'])
            ->find($id);

        if (!$vehiculo) {
            return $this->error('Vehículo no encontrado.', [], 404);
        }

        return $this->success($vehiculo);
    }

    public function campanias($id)
    {
        $vehiculo = Vehiculo::find($id);

        if (!$vehiculo) {
            return $this->error('Vehículo no encontrado.', [], 404);
        }

        $campanias = CampaniaVehiculo::where('vehiculo_id', $vehiculo->id)
            ->with('campania')
            ->get()
            ->map(function ($cv) {
                return [
                    'id' => $cv->id,
                    'campania' => $cv->campania,
                    'estado' => $cv->estado,
                    'fecha_realizacion' => $cv->fecha_realizacion,
                    'fecha_facturacion' => $cv->fecha_facturacion,
                    'numero_ot' => $cv->numero_ot,
                ];
            });

        return $this->success($campanias);
    }

    public function kitService($id, Request $request)
    {
        $kilometraje = $request->query('kilometraje', 0);

        $vehiculo = Vehiculo::find($id);

        if (!$vehiculo) {
            return $this->error('Vehículo no encontrado.', [], 404);
        }

        $kit = KitService::where('modelo_id', $vehiculo->modelo_id)
            ->where('anio_inicio', '<=', $vehiculo->anio)
            ->where('anio_final', '>=', $vehiculo->anio)
            ->where('kilometraje', '>=', $kilometraje)
            ->where('activo', true)
            ->orderBy('kilometraje', 'asc')
            ->first();

        if (!$kit) {
            return $this->error('No se encontró un kit de servicio para este vehículo.', [], 404);
        }

        $kit->load('items.articulo');

        return $this->success($kit);
    }

    public function misVehiculos(Request $request)
    {
        $cliente = $request->user()->cliente;

        if (!$cliente) {
            return $this->success([]);
        }

        $vehiculos = Vehiculo::where('cliente_id', $cliente->id)
            ->with('modelo.marca')
            ->get()
            ->map(function ($vehiculo) {
                $vehiculo->pending_recalls_count = CampaniaVehiculo::where('vehiculo_id', $vehiculo->id)
                    ->where('estado', 'pendiente')
                    ->count();
                return $vehiculo;
            });

        return $this->success($vehiculos);
    }

    public function vincular($id, Request $request)
    {
        $vehiculo = Vehiculo::find($id);

        if (!$vehiculo) {
            return $this->error('Vehículo no encontrado.', [], 404);
        }

        $cliente = $request->user()->cliente;

        if (!$cliente) {
            return $this->error('No tiene un perfil de cliente asociado.', [], 400);
        }

        if ($vehiculo->cliente_id && $vehiculo->cliente_id !== $cliente->id) {
            return $this->error('Este vehículo ya está vinculado a otro cliente.', [], 409);
        }

        $vehiculo->cliente_id = $cliente->id;
        $vehiculo->save();

        return $this->success($vehiculo, 'Vehículo vinculado exitosamente.');
    }
}
