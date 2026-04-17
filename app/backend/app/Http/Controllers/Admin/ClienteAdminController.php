<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function csvTemplate()
    {
        $headers = ['codigo_cliente', 'razon_social', 'ruc_ci', 'telefono', 'celular', 'email', 'direccion'];
        $example = ['CLI001', 'JUAN PEREZ', '1234567-8', '021123456', '0981123456', 'juan@email.com', 'Av. Principal 123'];

        $content = implode(',', $headers) . "\n" . implode(',', $example) . "\n";

        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, 'clientes_template.csv', ['Content-Type' => 'text/csv']);
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        $file   = $request->file('file');
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

            if (count($row) < 7) {
                $errors[] = "Fila {$rowIndex}: columnas insuficientes (se esperan 7).";
                $skipped++;
                continue;
            }

            [$codigo_cliente, $razon_social, $ruc_ci, $telefono, $celular, $email, $direccion] = $row;

            $ruc_ci = trim($ruc_ci);

            if (!empty($ruc_ci) && Cliente::where('ruc_ci', $ruc_ci)->exists()) {
                $errors[] = "Fila {$rowIndex}: ruc_ci '{$ruc_ci}' ya existe, fila omitida.";
                $skipped++;
                continue;
            }

            $data = [
                'empresa_id'     => 1,
                'codigo_cliente' => trim($codigo_cliente) ?: null,
                'razon_social'   => trim($razon_social),
                'ruc_ci'         => $ruc_ci ?: null,
                'telefono'       => trim($telefono) ?: null,
                'celular'        => trim($celular) ?: null,
                'email'          => trim($email) ?: null,
                'direccion'      => trim($direccion) ?: null,
            ];

            $validator = Validator::make($data, [
                'razon_social' => 'required|string|max:255',
                'ruc_ci'       => 'nullable|string|max:50',
                'email'        => 'nullable|email|max:255',
            ]);

            if ($validator->fails()) {
                $errors[] = "Fila {$rowIndex}: " . implode('; ', $validator->errors()->all());
                $skipped++;
                continue;
            }

            Cliente::create($data);
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
