import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientes, deleteCliente, importClientesCsv, getCsvTemplateUrl } from '../../../services/cliente.admin.service';
import CsvImportModal from '../../../components/admin/CsvImportModal';

export default function ClientesAdminPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-clientes', search, page],
    queryFn: () => getClientes({ search: search || undefined, page }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCliente,
    onSuccess: () => queryClient.invalidateQueries(['admin-clientes']),
  });

  const clientes = data?.data?.data || [];
  const meta = data?.data;

  const handleDelete = (c) => {
    if (window.confirm(`¿Eliminar al cliente ${c.razon_social}?`)) {
      deleteMutation.mutate(c.id);
    }
  };

  const handleImport = async (file) => {
    const res = await importClientesCsv(file);
    queryClient.invalidateQueries(['admin-clientes']);
    return res;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Clientes registrados en el sistema</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            Importar CSV
          </button>
          <Link
            to="/admin/clientes/nuevo"
            className="bg-honda-red text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            + Nuevo cliente
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Buscar por nombre, RUC/CI o email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-sm border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
        ) : clientes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay clientes registrados</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Nombre / Razón Social</th>
                <th className="px-4 py-3 text-left">RUC / CI</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.razon_social}</td>
                  <td className="px-4 py-3 text-gray-700">{c.ruc_ci || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{c.telefono || c.celular || '-'}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/clientes/${c.id}/editar`} className="text-blue-600 hover:underline">
                      Editar
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

      <CsvImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImport={handleImport}
        templateUrl={getCsvTemplateUrl()}
        entityName="Clientes"
      />
    </div>
  );
}
