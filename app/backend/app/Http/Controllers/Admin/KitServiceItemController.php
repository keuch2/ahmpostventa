<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\KitServiceItem;
use Illuminate\Http\Request;

class KitServiceItemController extends Controller
{
    use ApiResponse;

    public function index($kitServiceId)
    {
        $items = KitServiceItem::where('kit_service_id', $kitServiceId)
            ->with('articulo')
            ->get();

        return $this->success($items);
    }

    public function store(Request $request, $kitServiceId)
    {
        $validated = $request->validate([
            'articulo_id' => 'required|exists:articulos,id',
            'cantidad' => 'required|numeric|min:0.01',
            'precio_unitario' => 'required|numeric|min:0',
            'tipo' => 'required|string|in:producto,servicio',
            'tiempo_minutos' => 'nullable|integer|min:0',
            'lista_precio' => 'nullable|string|max:50',
        ]);

        $item = KitServiceItem::create(array_merge($validated, [
            'kit_service_id' => $kitServiceId,
        ]));

        return $this->success($item, 'Item agregado.', 201);
    }

    public function update(Request $request, $kitServiceId, $id)
    {
        $item = KitServiceItem::where('kit_service_id', $kitServiceId)
            ->where('id', $id)
            ->first();

        if (!$item) {
            return $this->error('Item no encontrado.', [], 404);
        }

        $validated = $request->validate([
            'articulo_id' => 'sometimes|exists:articulos,id',
            'cantidad' => 'sometimes|numeric|min:0.01',
            'precio_unitario' => 'sometimes|numeric|min:0',
            'tipo' => 'sometimes|string|in:producto,servicio',
            'tiempo_minutos' => 'nullable|integer|min:0',
            'lista_precio' => 'nullable|string|max:50',
        ]);

        $item->update($validated);

        return $this->success($item, 'Item actualizado.');
    }

    public function destroy($kitServiceId, $id)
    {
        $item = KitServiceItem::where('kit_service_id', $kitServiceId)
            ->where('id', $id)
            ->first();

        if (!$item) {
            return $this->error('Item no encontrado.', [], 404);
        }

        $item->delete();

        return $this->success(null, 'Item eliminado.');
    }
}
