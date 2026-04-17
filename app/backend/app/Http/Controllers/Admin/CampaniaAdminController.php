<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Campania;
use App\Models\CampaniaVehiculo;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class CampaniaAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Campania::where('empresa_id', 1)
            ->withCount([
                'vehiculos',
                'vehiculos as pendientes_count' => function ($q) {
                    $q->where('estado', 'pendiente');
                },
            ]);

        if ($request->filled('tipo')) {
            $query->where('tipo_campania', $request->tipo);
        }

        if ($request->filled('activo')) {
            $query->where('activo', filter_var($request->activo, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('registro_campania', 'LIKE', "%{$search}%")
                  ->orWhere('comentario', 'LIKE', "%{$search}%");
            });
        }

        $campanias = $query->orderBy('fecha', 'desc')->paginate(20);

        return $this->success($campanias);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'registro_campania' => 'required|string|max:255',
            'tipo_campania' => 'required|string|max:100',
            'fecha' => 'required|date',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'comentario' => 'nullable|string',
            'codigo_fabrica' => 'nullable|string|max:100',
            'nro_boletin' => 'nullable|string|max:100',
            'cantidad_vehiculos' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        $campania = Campania::create(array_merge($validated, [
            'empresa_id' => 1,
        ]));

        return $this->success($campania, 'Campaña creada exitosamente.', 201);
    }

    public function show($id)
    {
        $campania = Campania::with([
            'vehiculos.vehiculo.modelo',
            'vehiculos.vehiculo.cliente',
            'articulos.articulo',
        ])->find($id);

        if (!$campania) {
            return $this->error('Campaña no encontrada.', [], 404);
        }

        return $this->success($campania);
    }

    public function update(Request $request, $id)
    {
        $campania = Campania::find($id);

        if (!$campania) {
            return $this->error('Campaña no encontrada.', [], 404);
        }

        $validated = $request->validate([
            'registro_campania' => 'sometimes|string|max:255',
            'tipo_campania' => 'sometimes|string|max:100',
            'fecha' => 'sometimes|date',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'comentario' => 'nullable|string',
            'codigo_fabrica' => 'nullable|string|max:100',
            'nro_boletin' => 'nullable|string|max:100',
            'cantidad_vehiculos' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        $campania->update($validated);

        return $this->success($campania, 'Campaña actualizada.');
    }

    public function destroy($id)
    {
        $campania = Campania::find($id);

        if (!$campania) {
            return $this->error('Campaña no encontrada.', [], 404);
        }

        $facturados = $campania->vehiculos()->where('estado', 'facturado')->count();

        if ($facturados > 0) {
            return $this->error('No se puede eliminar una campaña con vehículos facturados.', [], 409);
        }

        $campania->delete();

        return $this->success(null, 'Campaña eliminada.');
    }

    public function actualizarVehiculo($campaniaId, $vehiculoId, Request $request)
    {
        $cv = CampaniaVehiculo::where('campania_id', $campaniaId)
            ->where('vehiculo_id', $vehiculoId)
            ->first();

        if (!$cv) {
            return $this->error('Registro no encontrado.', [], 404);
        }

        $validated = $request->validate([
            'estado' => 'sometimes|string|in:pendiente,en_proceso,realizado,facturado',
            'numero_ot' => 'nullable|string|max:100',
            'fecha_realizacion' => 'nullable|date',
            'fecha_facturacion' => 'nullable|date',
            'monto_facturado' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string',
        ]);

        $cv->update($validated);

        return $this->success($cv, 'Vehículo de campaña actualizado.');
    }

    public function importarChassis($id, Request $request)
    {
        $campania = Campania::find($id);

        if (!$campania) {
            return $this->error('Campaña no encontrada.', [], 404);
        }

        $validated = $request->validate([
            'chassis_list' => 'required|array',
            'chassis_list.*' => 'required|string',
        ]);

        $importados = 0;
        $no_encontrados = [];

        foreach ($validated['chassis_list'] as $vin) {
            $vehiculo = Vehiculo::where('nro_chassis', $vin)->first();

            if (!$vehiculo) {
                $no_encontrados[] = $vin;
                continue;
            }

            $existe = CampaniaVehiculo::where('campania_id', $campania->id)
                ->where('vehiculo_id', $vehiculo->id)
                ->exists();

            if (!$existe) {
                CampaniaVehiculo::create([
                    'campania_id' => $campania->id,
                    'vehiculo_id' => $vehiculo->id,
                    'estado' => 'pendiente',
                ]);
                $importados++;
            }
        }

        return $this->success([
            'importados' => $importados,
            'no_encontrados' => $no_encontrados,
            'total_no_encontrados' => count($no_encontrados),
        ], "Se importaron {$importados} vehículos.");
    }
}
