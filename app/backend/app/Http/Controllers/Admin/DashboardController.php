<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Campania;
use App\Models\CampaniaVehiculo;
use App\Models\CitaServicio;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $campanias_activas = Campania::where('empresa_id', 1)
            ->where('activo', true)
            ->count();

        $vehiculos_recall_pendiente = CampaniaVehiculo::where('estado', 'pendiente')
            ->count();

        $hoy = Carbon::today();

        $citas_hoy = CitaServicio::where('empresa_id', 1)
            ->whereDate('fecha_solicitada', $hoy)
            ->count();

        $citas_semana = CitaServicio::where('empresa_id', 1)
            ->whereBetween('fecha_solicitada', [
                $hoy->copy()->startOfWeek(),
                $hoy->copy()->endOfWeek(),
            ])
            ->count();

        $ultimas_campanias = Campania::where('empresa_id', 1)
            ->withCount([
                'vehiculos as total_vehiculos',
                'vehiculos as pendientes' => function ($query) {
                    $query->where('estado', 'pendiente');
                },
            ])
            ->orderBy('fecha', 'desc')
            ->limit(5)
            ->get();

        return $this->success([
            'campanias_activas' => $campanias_activas,
            'vehiculos_recall_pendiente' => $vehiculos_recall_pendiente,
            'citas_hoy' => $citas_hoy,
            'citas_semana' => $citas_semana,
            'ultimas_campanias' => $ultimas_campanias,
        ]);
    }
}
