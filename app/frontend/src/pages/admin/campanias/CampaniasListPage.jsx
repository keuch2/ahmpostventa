import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { campaniaService } from '../../../services/campania.service';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Spinner from '../../../components/ui/Spinner';
import Pagination from '../../../components/ui/Pagination';
import { formatDate } from '../../../utils/formatters';

export default function CampaniasListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['campanias', { page, search, tipo }],
    queryFn: () =>
      campaniaService.list({ page, search: search || undefined, tipo: tipo || undefined }).then((r) => r.data),
  });

  const campanias = data?.data ?? [];
  const meta = data?.meta ?? data ?? {};

  const columns = [
    { key: 'registro_campania', label: 'Registro' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'fecha', label: 'Fecha', render: (row) => formatDate(row.fecha) },
    { key: 'codigo_fabrica', label: 'Cod. Fabrica' },
    { key: 'nro_boletin', label: 'Boletin' },
    { key: 'vehiculos_count', label: 'Vehiculos', render: (row) => row.vehiculos_count ?? 0 },
    { key: 'pendientes_count', label: 'Pendientes', render: (row) => row.pendientes_count ?? 0 },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => (
        <Badge variant={row.estado === 'activo' ? 'success' : 'warning'}>
          {row.estado === 'activo' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <Link
          to={`/admin/campanias/${row.id}`}
          className="text-xs font-bold text-honda-red hover:underline"
        >
          Ver
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campanias</h1>
        <button
          disabled
          className="btn-honda px-4 py-2 text-xs opacity-50 cursor-not-allowed"
          title="Proximamente"
        >
          <i className="fa-solid fa-plus mr-2"></i>Nueva Campania
        </button>
      </div>

      <Card className="p-0">
        <div className="px-4 py-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              type="text"
              placeholder="Buscar por registro, boletin..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-honda-red"
            />
          </div>
          <select
            value={tipo}
            onChange={(e) => { setTipo(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-honda-red"
          >
            <option value="">Todos los tipos</option>
            <option value="recall">Recall</option>
            <option value="campania">Campania</option>
            <option value="servicio_especial">Servicio Especial</option>
          </select>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Table columns={columns} data={campanias} />
            <Pagination
              currentPage={meta.current_page ?? 1}
              lastPage={meta.last_page ?? 1}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}
