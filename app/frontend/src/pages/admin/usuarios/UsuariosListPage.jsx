import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsuarios, deleteUsuario, updateUsuario } from '../../../services/usuario.service';

const ROLE_LABELS = { admin: 'Admin', superadmin: 'Super Admin' };
const ROLE_COLORS = { admin: 'bg-blue-100 text-blue-700', superadmin: 'bg-purple-100 text-purple-700' };

export default function UsuariosListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-usuarios', search, page],
    queryFn: () => getUsuarios({ search, page }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => queryClient.invalidateQueries(['admin-usuarios']),
  });

  const toggleActivoMutation = useMutation({
    mutationFn: ({ id, activo }) => updateUsuario(id, { activo }),
    onSuccess: () => queryClient.invalidateQueries(['admin-usuarios']),
  });

  const usuarios = data?.data?.data || [];
  const meta = data?.data;

  const handleDelete = (u) => {
    if (confirm(`¿Eliminar a ${u.nombre}?`)) deleteMutation.mutate(u.id);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Usuarios Admin</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de administradores del sistema</p>
        </div>
        <Link
          to="/admin/usuarios/nuevo"
          className="bg-honda-red text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          + Nuevo usuario
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-sm border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
        ) : usuarios.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay usuarios</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-600'}`}>
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActivoMutation.mutate({ id: u.id, activo: !u.activo })}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer ${u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/usuarios/${u.id}/editar`} className="text-blue-600 hover:underline">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(u)}
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
