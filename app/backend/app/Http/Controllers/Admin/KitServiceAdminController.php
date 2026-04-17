<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\KitService;
use App\Models\KitServiceItem;
use Illuminate\Http\Request;

class KitServiceAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = KitService::where('empresa_id', 1)
            ->with('modelo.marca');

        if ($request->filled('modelo_id')) {
            $query->where('modelo_id', $request->modelo_id);
        }

        if ($request->filled('kilometraje')) {
            $query->where('kilometraje', $request->kilometraje);
        }

        if ($request->filled('activo')) {
            $query->where('activo', filter_var($request->activo, FILTER_VALIDATE_BOOLEAN));
        }

        $kits = $query->orderBy('id', 'desc')->paginate(20);

        return $this->success($kits);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_combo' => 'required|string|max:100',
            'modelo_id' => 'required|exists:modelos,id',
            'codigo_grado' => 'nullable|string|max:50',
            'vds' => 'nullable|string|max:50',
            'anio_inicio' => 'required|integer|min:1900',
            'anio_final' => 'required|integer|min:1900',
            'carroceria' => 'nullable|string|max:50',
            'transmision_id' => 'nullable|exists:tipo_transmisiones,id',
            'combustible_id' => 'nullable|exists:tipo_combustibles,id',
            'tipo_motor' => 'nullable|string|max:50',
            'kilometraje' => 'required|integer|min:0',
            'descripcion' => 'nullable|string',
            'express' => 'boolean',
            'activo' => 'boolean',
        ]);

        $kit = KitService::create(array_merge($validated, [
            'empresa_id' => 1,
        ]));

        return $this->success($kit, 'Kit de servicio creado.', 201);
    }

    public function show($id)
    {
        $kit = KitService::with(['items.articulo', 'modelo.marca'])->find($id);

        if (!$kit) {
            return $this->error('Kit de servicio no encontrado.', [], 404);
        }

        $kit->append(['total_productos', 'total_servicios', 'total']);

        return $this->success($kit);
    }

    public function update(Request $request, $id)
    {
        $kit = KitService::find($id);

        if (!$kit) {
            return $this->error('Kit de servicio no encontrado.', [], 404);
        }

        $validated = $request->validate([
            'codigo_combo' => 'sometimes|string|max:100',
            'modelo_id' => 'sometimes|exists:modelos,id',
            'codigo_grado' => 'nullable|string|max:50',
            'vds' => 'nullable|string|max:50',
            'anio_inicio' => 'sometimes|integer|min:1900',
            'anio_final' => 'sometimes|integer|min:1900',
            'carroceria' => 'nullable|string|max:50',
            'transmision_id' => 'nullable|exists:tipo_transmisiones,id',
            'combustible_id' => 'nullable|exists:tipo_combustibles,id',
            'tipo_motor' => 'nullable|string|max:50',
            'kilometraje' => 'sometimes|integer|min:0',
            'descripcion' => 'nullable|string',
            'express' => 'boolean',
            'activo' => 'boolean',
        ]);

        $kit->update($validated);

        return $this->success($kit, 'Kit de servicio actualizado.');
    }

    public function destroy($id)
    {
        $kit = KitService::find($id);

        if (!$kit) {
            return $this->error('Kit de servicio no encontrado.', [], 404);
        }

        $kit->delete();

        return $this->success(null, 'Kit de servicio eliminado.');
    }

    public function duplicar($id, Request $request)
    {
        $original = KitService::with('items')->find($id);

        if (!$original) {
            return $this->error('Kit de servicio no encontrado.', [], 404);
        }

        $nuevo = $original->replicate();
        $nuevo->codigo_combo = $original->codigo_combo . ' (copia)';
        $nuevo->save();

        foreach ($original->items as $item) {
            $nuevoItem = $item->replicate();
            $nuevoItem->kit_service_id = $nuevo->id;
            $nuevoItem->save();
        }

        $nuevo->load('items.articulo');

        return $this->success($nuevo, 'Kit de servicio duplicado.', 201);
    }
}
