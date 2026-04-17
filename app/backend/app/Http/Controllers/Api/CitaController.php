<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\CitaServicio;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    use ApiResponse;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehiculo_id' => 'required|exists:vehiculos,id',
            'tipo_servicio' => 'required|string',
            'fecha_solicitada' => 'required|date|after:now',
            'kilometraje' => 'nullable|integer',
            'comentarios' => 'nullable|string',
            'kit_service_id' => 'nullable|exists:kits_service,id',
            'campania_vehiculo_id' => 'nullable|exists:campania_vehiculos,id',
        ]);

        $cliente = $request->user()->cliente;

        if (!$cliente) {
            return $this->error('No tiene un perfil de cliente asociado.', [], 400);
        }

        $cita = CitaServicio::create(array_merge($validated, [
            'empresa_id' => 1,
            'cliente_id' => $cliente->id,
            'estado' => 'pendiente',
        ]));

        return $this->success($cita, 'Cita creada exitosamente.', 201);
    }

    public function misCitas(Request $request)
    {
        $cliente = $request->user()->cliente;

        if (!$cliente) {
            return $this->success([]);
        }

        $citas = CitaServicio::where('cliente_id', $cliente->id)
            ->with(['vehiculo.modelo', 'kitService'])
            ->orderBy('fecha_solicitada', 'desc')
            ->get();

        return $this->success($citas);
    }
}
