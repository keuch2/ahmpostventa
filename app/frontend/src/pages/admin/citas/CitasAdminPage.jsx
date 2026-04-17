import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCitas, deleteCita } from '../../../services/cita.admin.service';

const ESTADO_BADGE = {
  solicitada: 'bg-yellow-100 text-yellow-700',
  confirmada: 'bg-blue-100 text-blue-700',
  en_proceso: 'bg-orange-100 text-orange-700',
  completada: 'bg-green-100 text-green-700',
  cancelada: 'bg-gray-100 text-gray-500',
};

const ESTADO_LABELS = {
  solicitada: 'Solicitada',
  confirmada: 'Confirmada',
  en_proceso: 'En Proceso',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

export default function CitasAdminPage() {
  const [page, setPage] = useState(1);
  const [estado, setEstado] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-citas', estado, page],
    queryFn: () => getCitas({ page, estado: estado || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCita,
    onSuccess: () => queryClient.invalidateQueries(['admin-citas']),
  });

  const citas = data?.data?.data || [];
  const meta = data?.data;

  const handleDelete = (c) => {
    if (window.confirm(`¿Eliminar la cita #${c.id}?`)) {
      deleteMutation.mutate(c.id);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Citas de Servicio</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de citas y turnos de servicio</p>
        </div>
        <Link
          to="/admin/citas/nueva"
          className="bg-honda-red text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          + Nueva cita
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <select
            value={estado}
            onChange={e => { setEstado(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="solicitada">Solicitada</option>
            <option value="confirmada">Confirmada</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
        ) : citas.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay citas registradas</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Vehículo</th>
                <th className="px-4 py-3 text-left">Tipo Servicio</th>
                <th className="px-4 py-3 text-left">Fecha Solicitada</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {citas.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">#{c.id}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {c.cliente?.razon_social || c.cliente?.nombre || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                    {c.vehiculo?.nro_chassis || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-700 capitalize">{c.tipo_servicio || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{formatFecha(c.fecha_solicitada)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_BADGE[c.estado] || 'bg-gray-100 text-gray-500'}`}>
                      {ESTADO_LABELS[c.estado] || c.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/citas/${c.id}/editar`} className="text-blue-600 hover:underline">
                      Ver/Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(c)}
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
