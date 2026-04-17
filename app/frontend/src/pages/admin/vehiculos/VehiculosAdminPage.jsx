import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVehiculos } from '../../../services/vehiculo.admin.service';

export default function VehiculosAdminPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-vehiculos', search, page],
    queryFn: () => getVehiculos({ search: search || undefined, page }),
  });

  const vehiculos = data?.data?.data || [];
  const meta = data?.data;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Vehículos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Vehículos registrados en el sistema</p>
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
                <th className="px-4 py-3 text-left">Cliente</th>
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
                  <td className="px-4 py-3 text-gray-600">{v.cliente?.razon_social || '-'}</td>
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
    </div>
  );
}
