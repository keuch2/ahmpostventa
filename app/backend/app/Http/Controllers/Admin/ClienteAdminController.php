<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Cliente::where('empresa_id', 1)
            ->with('user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('razon_social', 'LIKE', "%{$search}%")
                  ->orWhere('ruc_ci', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $clientes = $query->orderBy('id', 'desc')->paginate(20);

        return $this->success($clientes);
    }

    public function show($id)
    {
        $cliente = Cliente::with(['vehiculos.modelo', 'user'])->find($id);

        if (!$cliente) {
            return $this->error('Cliente no encontrado.', [], 404);
        }

        return $this->success($cliente);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_cliente' => 'nullable|string|max:50',
            'razon_social' => 'required|string|max:255',
            'ruc_ci' => 'nullable|string|max:50',
            'telefono' => 'nullable|string|max:50',
            'celular' => 'nullable|string|max:50',
            'celular2' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'direccion' => 'nullable|string|max:500',
            'cod_sucursal' => 'nullable|string|max:50',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $cliente = Cliente::create(array_merge($validated, [
            'empresa_id' => 1,
        ]));

        return $this->success($cliente, 'Cliente creado.', 201);
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return $this->error('Cliente no encontrado.', [], 404);
        }

        $validated = $request->validate([
            'codigo_cliente' => 'nullable|string|max:50',
            'razon_social' => 'sometimes|string|max:255',
            'ruc_ci' => 'nullable|string|max:50',
            'telefono' => 'nullable|string|max:50',
            'celular' => 'nullable|string|max:50',
            'celular2' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'direccion' => 'nullable|string|max:500',
            'cod_sucursal' => 'nullable|string|max:50',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $cliente->update($validated);

        return $this->success($cliente, 'Cliente actualizado.');
    }

    public function destroy($id)
    {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return $this->error('Cliente no encontrado.', [], 404);
        }

        $cliente->delete();

        return $this->success(null, 'Cliente eliminado.');
    }
}
