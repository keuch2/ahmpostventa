<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function csvTemplate()
    {
        $headers = ['nro_chassis', 'matricula', 'modelo_id', 'anio', 'carroceria', 'color', 'transmision_id', 'combustible_id', 'kilometraje_actual', 'fecha_venta'];
        $example = ['XXXXXXXXXXXXXXXXX', 'AAA123', '1', '2023', 'SEDAN', 'BLANCO', '1', '1', '0', '2023-01-15'];

        $content = implode(',', $headers) . "\n" . implode(',', $example) . "\n";

        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, 'vehiculos_template.csv', ['Content-Type' => 'text/csv']);
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        if ($handle === false) {
            return $this->error('No se pudo leer el archivo.', [], 422);
        }

        $imported = 0;
        $skipped  = 0;
        $errors   = [];
        $rowIndex = 0;

        // Skip header row
        $headerRow = fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            $rowIndex++;

            if (count($row) < 10) {
                $errors[] = "Fila {$rowIndex}: columnas insuficientes (se esperan 10).";
                $skipped++;
                continue;
            }

            [$nro_chassis, $matricula, $modelo_id, $anio, $carroceria, $color, $transmision_id, $combustible_id, $kilometraje_actual, $fecha_venta] = $row;

            $nro_chassis = trim($nro_chassis);

            if (empty($nro_chassis)) {
                $errors[] = "Fila {$rowIndex}: nro_chassis vacío, fila omitida.";
                $skipped++;
                continue;
            }

            if (Vehiculo::where('nro_chassis', $nro_chassis)->exists()) {
                $errors[] = "Fila {$rowIndex}: nro_chassis '{$nro_chassis}' ya existe, fila omitida.";
                $skipped++;
                continue;
            }

            $data = [
                'empresa_id'        => 1,
                'nro_chassis'       => $nro_chassis,
                'matricula'         => trim($matricula) ?: null,
                'modelo_id'         => is_numeric(trim($modelo_id)) ? (int) trim($modelo_id) : null,
                'anio'              => is_numeric(trim($anio)) ? (int) trim($anio) : null,
                'carroceria'        => trim($carroceria) ?: null,
                'color'             => trim($color) ?: null,
                'transmision_id'    => is_numeric(trim($transmision_id)) ? (int) trim($transmision_id) : null,
                'combustible_id'    => is_numeric(trim($combustible_id)) ? (int) trim($combustible_id) : null,
                'kilometraje_actual'=> is_numeric(trim($kilometraje_actual)) ? (int) trim($kilometraje_actual) : 0,
                'fecha_venta'       => trim($fecha_venta) ?: null,
            ];

            $validator = Validator::make($data, [
                'nro_chassis' => 'required|string|max:50',
                'modelo_id'   => 'nullable|exists:modelos,id',
                'anio'        => 'nullable|integer|min:1900',
                'transmision_id' => 'nullable|exists:tipo_transmisiones,id',
                'combustible_id' => 'nullable|exists:tipo_combustibles,id',
                'kilometraje_actual' => 'nullable|integer|min:0',
                'fecha_venta' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                $errors[] = "Fila {$rowIndex}: " . implode('; ', $validator->errors()->all());
                $skipped++;
                continue;
            }

            Vehiculo::create($data);
            $imported++;
        }

        fclose($handle);

        return $this->success([
            'imported' => $imported,
            'skipped'  => $skipped,
            'errors'   => $errors,
        ], "Importación completada: {$imported} importados, {$skipped} omitidos.");
    }
}
