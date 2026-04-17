import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { citaService } from '../../../services/cita.service';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Spinner from '../../../components/ui/Spinner';
import Pagination from '../../../components/ui/Pagination';
import { formatDate } from '../../../utils/formatters';

const estadoVariants = {
  solicitada: 'warning',
  confirmada: 'info',
  en_proceso: 'info',
  completada: 'success',
  cancelada: 'danger',
};

const estadoLabels = {
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
    queryKey: ['admin-citas', { page, estado }],
    queryFn: () =>
      citaService.list({ page, estado: estado || undefined }).then((r) => r.data),
  });

  const confirmarMutation = useMutation({
    mutationFn: (id) =>
      citaService.update(id, {
        estado: 'confirmada',
        fecha_confirmada: new Date().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-citas'] });
    },
  });

  const citas = data?.data ?? [];
  const meta = data?.meta ?? data ?? {};

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (row) => row.cliente?.razon_social ?? row.razon_social ?? '-',
    },
    {
      key: 'vehiculo',
      label: 'Vehiculo',
      render: (row) => row.vehiculo?.modelo?.nombre ?? row.vehiculo_modelo ?? '-',
    },
    { key: 'tipo_servicio', label: 'Tipo Servicio' },
    {
      key: 'fecha_solicitada',
      label: 'Fecha Solicitada',
      render: (row) => formatDate(row.fecha_solicitada),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => (
        <Badge variant={estadoVariants[row.estado] ?? 'info'}>
          {estadoLabels[row.estado] ?? row.estado}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) =>
        row.estado === 'solicitada' ? (
          <button
            onClick={() => confirmarMutation.mutate(row.id)}
            disabled={confirmarMutation.isPending}
            className="text-xs font-bold text-honda-red hover:underline disabled:opacity-50"
          >
            <i className="fa-solid fa-check mr-1"></i>Confirmar
          </button>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Citas de Servicio</h1>
      </div>

      <Card className="p-0">
        <div className="px-4 py-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
          <select
            value={estado}
            onChange={(e) => { setEstado(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-honda-red"
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
          <Spinner />
        ) : (
          <>
            <Table columns={columns} data={citas} />
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
