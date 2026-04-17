<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = User::whereIn('role', ['admin', 'superadmin'])
            ->select('id', 'nombre', 'email', 'role', 'activo', 'created_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('id', 'desc')->paginate(20);

        return $this->success($users);
    }

    public function show($id)
    {
        $user = User::whereIn('role', ['admin', 'superadmin'])
            ->select('id', 'nombre', 'email', 'role', 'activo', 'telefono', 'celular', 'created_at')
            ->find($id);

        if (!$user) {
            return $this->error('Usuario no encontrado.', [], 404);
        }

        return $this->success($user);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'   => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => ['required', Rule::in(['admin', 'superadmin'])],
            'telefono' => 'nullable|string|max:50',
            'celular'  => 'nullable|string|max:50',
            'activo'   => 'boolean',
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'activo'   => $validated['activo'] ?? true,
        ]);

        return $this->success(
            $user->only('id', 'nombre', 'email', 'role', 'activo'),
            'Usuario administrador creado.',
            201
        );
    }

    public function update(Request $request, $id)
    {
        $user = User::whereIn('role', ['admin', 'superadmin'])->find($id);

        if (!$user) {
            return $this->error('Usuario no encontrado.', [], 404);
        }

        $validated = $request->validate([
            'nombre'   => 'sometimes|string|max:255',
            'email'    => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($id)],
            'password' => 'nullable|string|min:8',
            'role'     => ['sometimes', Rule::in(['admin', 'superadmin'])],
            'telefono' => 'nullable|string|max:50',
            'celular'  => 'nullable|string|max:50',
            'activo'   => 'boolean',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return $this->success(
            $user->fresh()->only('id', 'nombre', 'email', 'role', 'activo'),
            'Usuario actualizado.'
        );
    }

    public function destroy($id)
    {
        $user = User::whereIn('role', ['admin', 'superadmin'])->find($id);

        if (!$user) {
            return $this->error('Usuario no encontrado.', [], 404);
        }

        if ($user->id === auth()->id()) {
            return $this->error('No podés eliminar tu propio usuario.', [], 403);
        }

        $user->delete();

        return $this->success(null, 'Usuario eliminado.');
    }
}
