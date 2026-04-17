import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehiculos, deleteVehiculo, importVehiculosCsv, getCsvTemplateUrl } from '../../../services/vehiculo.admin.service';
import CsvImportModal from '../../../components/admin/CsvImportModal';

export default function VehiculosAdminPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-vehiculos', search, page],
    queryFn: () => getVehiculos({ search: search || undefined, page }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehiculo,
    onSuccess: () => queryClient.invalidateQueries(['admin-vehiculos']),
  });

  const vehiculos = data?.data?.data || [];
  const meta = data?.data;

  const handleDelete = (v) => {
    if (window.confirm(`¿Eliminar el vehículo con chassis ${v.nro_chassis}?`)) {
      deleteMutation.mutate(v.id);
    }
  };

  const handleImport = async (file) => {
    const res = await importVehiculosCsv(file);
    queryClient.invalidateQueries(['admin-vehiculos']);
    return res;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Vehículos registrados en el sistema</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            Importar CSV
          </button>
          <Link
            to="/admin/vehiculos/nuevo"
            className="bg-honda-red text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            + Nuevo vehículo
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Buscar por chassis o matrícula..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-sm border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
        ) : vehiculos.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay vehículos registrados</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Chassis</th>
                <th className="px-4 py-3 text-left">Matrícula</th>
                <th className="px-4 py-3 text-left">Modelo</th>
                <th className="px-4 py-3 text-left">Año</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehiculos.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{v.nro_chassis}</td>
                  <td className="px-4 py-3 text-gray-700">{v.matricula || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {v.modelo?.marca?.nombre} {v.modelo?.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{v.anio || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{v.cliente?.razon_social || '-'}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/vehiculos/${v.id}/editar`} className="text-blue-600 hover:underline">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(v)}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {meta && meta.last_page > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Página {meta.current_page} de {meta.last_page}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-40">Anterior</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page === meta.last_page} className="px-3 py-1 border rounded disabled:opacity-40">Siguiente</button>
            </div>
          </div>
        )}
      </div>

      <CsvImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImport={handleImport}
        templateUrl={getCsvTemplateUrl()}
        entityName="Vehículos"
      />
    </div>
  );
}
