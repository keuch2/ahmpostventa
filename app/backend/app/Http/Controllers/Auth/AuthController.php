<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
        ]);

        $user = User::create([
            'empresa_id' => 1,
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => 'cliente',
        ]);

        Cliente::create([
            'empresa_id' => 1,
            'user_id' => $user->id,
            'razon_social' => $validated['nombre'],
            'email' => $validated['email'],
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => $user,
            'token' => $token,
        ], 'Registro exitoso.', 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->error('Credenciales incorrectas.', [], 401);
        }

        $user = Auth::user();
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        $user->load('empresa', 'cliente');

        return $this->success([
            'user' => $user,
            'token' => $token,
        ], 'Login exitoso.');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Sesión cerrada.');
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $user->load('empresa', 'cliente');

        return $this->success($user);
    }
}
