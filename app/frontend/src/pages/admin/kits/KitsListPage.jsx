import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { kitServiceService } from '../../../services/kitservice.service';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Spinner from '../../../components/ui/Spinner';
import Pagination from '../../../components/ui/Pagination';

export default function KitsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modelo, setModelo] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['kits', { page, search, modelo }],
    queryFn: () =>
      kitServiceService.list({ page, search: search || undefined, modelo: modelo || undefined }).then((r) => r.data),
  });

  const kits = data?.data ?? [];
  const meta = data?.meta ?? data ?? {};

  const columns = [
    { key: 'codigo_combo', label: 'Codigo Combo' },
    {
      key: 'modelo',
      label: 'Modelo',
      render: (row) => row.modelo?.nombre ?? row.modelo_nombre ?? '-',
    },
    {
      key: 'anio',
      label: 'Ano Inicio-Fin',
      render: (row) => `${row.anio_inicio ?? '-'} - ${row.anio_fin ?? '-'}`,
    },
    { key: 'kilometraje', label: 'Kilometraje', render: (row) => `${row.kilometraje ?? 0} km` },
    { key: 'descripcion', label: 'Descripcion' },
    {
      key: 'express',
      label: 'Express',
      render: (row) => (
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide ${
            row.express ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {row.express ? 'Si' : 'No'}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <Link
          to={`/admin/kits/${row.id}`}
          className="text-xs font-bold text-honda-red hover:underline"
        >
          Ver
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kits de Service</h1>
      </div>

      <Card className="p-0">
        <div className="px-4 py-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              type="text"
              placeholder="Buscar por codigo, descripcion..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-honda-red"
            />
          </div>
          <input
            type="text"
            placeholder="Filtrar por modelo"
            value={modelo}
            onChange={(e) => { setModelo(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-honda-red"
          />
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Table columns={columns} data={kits} />
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
