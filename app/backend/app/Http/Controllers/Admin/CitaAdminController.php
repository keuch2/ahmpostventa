<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\CitaServicio;
use Illuminate\Http\Request;

class CitaAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = CitaServicio::where('empresa_id', 1)
            ->with(['cliente', 'vehiculo.modelo']);

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('fecha')) {
            $query->whereDate('fecha_solicitada', $request->fecha);
        }

        $citas = $query->orderBy('fecha_solicitada', 'desc')->paginate(20);

        return $this->success($citas);
    }

    public function show($id)
    {
        $cita = CitaServicio::with([
            'cliente',
            'vehiculo.modelo.marca',
            'kitService',
            'campaniaVehiculo.campania',
        ])->find($id);

        if (!$cita) {
            return $this->error('Cita no encontrada.', [], 404);
        }

        return $this->success($cita);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id'       => 'required|exists:clientes,id',
            'vehiculo_id'      => 'required|exists:vehiculos,id',
            'tipo_servicio'    => 'required|string|max:100',
            'fecha_solicitada' => 'required|date',
            'kilometraje'      => 'nullable|integer|min:0',
            'comentarios'      => 'nullable|string',
            'kit_service_id'   => 'nullable|exists:kit_services,id',
            'estado'           => 'nullable|string|in:solicitada,pendiente,confirmada,en_proceso,completada,cancelada',
        ]);

        $cita = CitaServicio::create(array_merge($validated, [
            'empresa_id' => 1,
            'estado'     => $validated['estado'] ?? 'solicitada',
        ]));

        $cita->load(['cliente', 'vehiculo.modelo.marca', 'kitService']);

        return $this->success($cita, 'Cita creada.', 201);
    }

    public function update(Request $request, $id)
    {
        $cita = CitaServicio::find($id);

        if (!$cita) {
            return $this->error('Cita no encontrada.', [], 404);
        }

        $validated = $request->validate([
            'estado' => 'sometimes|string|in:solicitada,pendiente,confirmada,en_proceso,completada,cancelada',
            'fecha_confirmada' => 'nullable|date',
        ]);

        $cita->update($validated);

        return $this->success($cita, 'Cita actualizada.');
    }

    public function destroy($id)
    {
        $cita = CitaServicio::find($id);

        if (!$cita) {
            return $this->error('Cita no encontrada.', [], 404);
        }

        $cita->delete();

        return $this->success(null, 'Cita eliminada.');
    }
}
