import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKits, deleteKit } from '../../../services/kit.service';

export default function KitsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-kits', search, page],
    queryFn: () => getKits({ page, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteKit,
    onSuccess: () => queryClient.invalidateQueries(['admin-kits']),
  });

  const kits = data?.data?.data || [];
  const meta = data?.data;

  const handleDelete = (k) => {
    if (window.confirm(`¿Eliminar el kit ${k.codigo_combo}?`)) {
      deleteMutation.mutate(k.id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kits de Service</h1>
          <p className="text-sm text-gray-500 mt-0.5">Combos de mantenimiento por modelo y kilometraje</p>
        </div>
        <Link
          to="/admin/kits-service/nuevo"
          className="bg-honda-red text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          + Nuevo Kit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Buscar por código, descripción..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-sm border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
        ) : kits.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay kits registrados</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Código Combo</th>
                <th className="px-4 py-3 text-left">Modelo</th>
                <th className="px-4 py-3 text-left">Año Inicio-Fin</th>
                <th className="px-4 py-3 text-left">Kilometraje</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">Express</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {kits.map(k => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{k.codigo_combo}</td>
                  <td className="px-4 py-3 text-gray-700">{k.modelo?.nombre || k.modelo_nombre || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{k.anio_inicio ?? '-'} - {k.anio_final ?? k.anio_fin ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{k.kilometraje ?? 0} km</td>
                  <td className="px-4 py-3 text-gray-600">{k.descripcion || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${k.express ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {k.express ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/kits-service/${k.id}`} className="text-blue-600 hover:underline">
                      Ver
                    </Link>
                    <Link to={`/admin/kits-service/${k.id}/editar`} className="text-blue-600 hover:underline">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(k)}
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
    </div>
  );
}
