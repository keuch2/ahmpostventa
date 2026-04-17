<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\VehiculoController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\CampaniaAdminController;
use App\Http\Controllers\Admin\KitServiceAdminController;
use App\Http\Controllers\Admin\KitServiceItemController;
use App\Http\Controllers\Admin\VehiculoAdminController;
use App\Http\Controllers\Admin\ClienteAdminController;
use App\Http\Controllers\Admin\CitaAdminController;
use App\Http\Controllers\Admin\UserAdminController;

Route::prefix('v1')->group(function () {
    // Auth (public)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public search & catalog
    Route::get('/catalogo', [VehiculoController::class, 'catalogo']);
    Route::get('/vehiculos/buscar', [VehiculoController::class, 'buscar']);
    Route::get('/vehiculos/buscar-modelo', [VehiculoController::class, 'buscarPorModelo']);

    // Authenticated (client or admin)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::get('/vehiculos/{id}', [VehiculoController::class, 'show']);
        Route::get('/vehiculos/{id}/campanias', [VehiculoController::class, 'campanias']);
        Route::get('/vehiculos/{id}/kit-service', [VehiculoController::class, 'kitService']);
        Route::get('/mis-vehiculos', [VehiculoController::class, 'misVehiculos']);
        Route::post('/mis-vehiculos/{id}/vincular', [VehiculoController::class, 'vincular']);

        Route::post('/citas', [CitaController::class, 'store']);
        Route::get('/mis-citas', [CitaController::class, 'misCitas']);
    });

    // Admin
    Route::middleware(['auth:sanctum', 'role:admin,superadmin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::apiResource('/campanias', CampaniaAdminController::class);
        Route::put('/campanias/{id}/vehiculos/{vid}', [CampaniaAdminController::class, 'actualizarVehiculo']);
        Route::post('/campanias/{id}/importar-chassis', [CampaniaAdminController::class, 'importarChassis']);

        Route::apiResource('/kits-service', KitServiceAdminController::class);
        Route::post('/kits-service/{id}/duplicar', [KitServiceAdminController::class, 'duplicar']);
        Route::get('/kits-service/{kitServiceId}/items', [KitServiceItemController::class, 'index']);
        Route::post('/kits-service/{kitServiceId}/items', [KitServiceItemController::class, 'store']);
        Route::put('/kits-service/{kitServiceId}/items/{id}', [KitServiceItemController::class, 'update']);
        Route::delete('/kits-service/{kitServiceId}/items/{id}', [KitServiceItemController::class, 'destroy']);

        Route::apiResource('/vehiculos', VehiculoAdminController::class);
        Route::apiResource('/clientes', ClienteAdminController::class);
        Route::get('/citas', [CitaAdminController::class, 'index']);
        Route::get('/citas/{id}', [CitaAdminController::class, 'show']);
        Route::put('/citas/{id}', [CitaAdminController::class, 'update']);

        Route::apiResource('/usuarios', UserAdminController::class);
    });
});
