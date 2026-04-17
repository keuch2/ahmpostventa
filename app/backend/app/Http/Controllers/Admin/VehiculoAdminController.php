<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Vehiculo::where('empresa_id', 1)
            ->with(['modelo.marca', 'cliente']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nro_chassis', 'LIKE', "%{$search}%")
                  ->orWhere('matricula', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('modelo_id')) {
            $query->where('modelo_id', $request->modelo_id);
        }

        $vehiculos = $query->orderBy('id', 'desc')->paginate(20);

        return $this->success($vehiculos);
    }

    public function show($id)
    {
        $vehiculo = Vehiculo::with([
            'modelo.marca',
            'transmision',
            'combustible',
            'cliente',
            'campaniaVehiculos.campania',
            'citasServicio',
        ])->find($id);

        if (!$vehiculo) {
            return $this->error('Vehículo no encontrado.', [], 404);
        }

        return $this->success($vehiculo);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nro_chassis' => 'required|string|max:50|unique:vehiculos,nro_chassis',
            'matricula' => 'nullable|string|max:20',
            'modelo_id' => 'required|exists:modelos,id',
            'anio' => 'required|integer|min:1900',
            'carroceria' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'vds' => 'nullable|string|max:50',
            'transmision_id' => 'nullable|exists:tipo_transmisiones,id',
            'combustible_id' => 'nullable|exists:tipo_combustibles,id',
            'kilometraje_actual' => 'nullable|integer|min:0',
            'fecha_venta' => 'nullable|date',
            'cliente_id' => 'nullable|exists:clientes,id',
            'imagen_url' => 'nullable|string|max:500',
        ]);

        $vehiculo = Vehiculo::create(array_merge($validated, [
            'empresa_id' => 1,
        ]));

        return $this->success($vehiculo, 'Vehículo creado.', 201);
    }

    public function update(Request $request, $id)
    {
        $vehiculo = Vehiculo::find($id);

        if (!$vehiculo) {
            return $this->error('Vehículo no encontrado.', [], 404);
        }

        $validated = $request->validate([
            'nro_chassis' => "sometimes|string|max:50|unique:vehiculos,nro_chassis,{$id}",
            'matricula' => 'nullable|string|max:20',
            'modelo_id' => 'sometimes|exists:modelos,id',
            'anio' => 'sometimes|integer|min:1900',
            'carroceria' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'vds' => 'nullable|string|max:50',
            'transmision_id' => 'nullable|exists:tipo_transmisiones,id',
            'combustible_id' => 'nullable|exists:tipo_combustibles,id',
            'kilometraje_actual' => 'nullable|integer|min:0',
            'fecha_venta' => 'nullable|date',
            'cliente_id' => 'nullable|exists:clientes,id',
            'imagen_url' => 'nullable|string|max:500',
        ]);

        $vehiculo->update($validated);

        return $this->success($vehiculo, 'Vehículo actualizado.');
    }

    public function destroy($id)
    {
        $vehiculo = Vehiculo::find($id);

        if (!$vehiculo) {
            return $this->error('Vehículo no encontrado.', [], 404);
        }

        $vehiculo->delete();

        return $this->success(null, 'Vehículo eliminado.');
    }
}
