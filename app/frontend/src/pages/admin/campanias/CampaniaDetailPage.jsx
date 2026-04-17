import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaniaService } from '../../../services/campania.service';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';
import { formatDate, formatPYG } from '../../../utils/formatters';

const TABS = [
  { key: 'pendientes', label: 'Vehiculos Pendientes', icon: 'fa-clock' },
  { key: 'facturados', label: 'Facturados', icon: 'fa-check-circle' },
  { key: 'articulos', label: 'Articulos/Servicios', icon: 'fa-box' },
];

export default function CampaniaDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pendientes');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [formData, setFormData] = useState({
    numero_ot: '',
    fecha_realizacion: new Date().toISOString().split('T')[0],
  });

  const { data, isLoading } = useQuery({
    queryKey: ['campania', id],
    queryFn: () => campaniaService.show(id).then((r) => r.data),
  });

  const mutation = useMutation({
    mutationFn: ({ vehiculoId, payload }) =>
      campaniaService.actualizarVehiculo(id, vehiculoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campania', id] });
      setModalOpen(false);
      setSelectedVehiculo(null);
      setFormData({ numero_ot: '', fecha_realizacion: new Date().toISOString().split('T')[0] });
    },
  });

  if (isLoading) return <Spinner />;

  const campania = data?.data ?? data ?? {};
  const vehiculos = campania.vehiculos ?? [];
  const pendientes = vehiculos.filter((v) => v.estado === 'pendiente');
  const facturados = vehiculos.filter((v) => v.estado === 'realizado');
  const articulos = campania.articulos ?? [];

  const handleMarcarRealizado = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVehiculo) return;
    mutation.mutate({
      vehiculoId: selectedVehiculo.id,
      payload: {
        estado: 'realizado',
        numero_ot: formData.numero_ot,
        fecha_realizacion: formData.fecha_realizacion,
      },
    });
  };

  return (
    <div>
      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{campania.registro_campania}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span>
                <i className="fa-solid fa-tag mr-1"></i>{campania.tipo}
              </span>
              <span>
                <i className="fa-solid fa-calendar mr-1"></i>{formatDate(campania.fecha)}
              </span>
              {campania.codigo_fabrica && (
                <span>
                  <i className="fa-solid fa-industry mr-1"></i>{campania.codigo_fabrica}
                </span>
              )}
              {campania.nro_boletin && (
                <span>
                  <i className="fa-solid fa-file-lines mr-1"></i>Boletin: {campania.nro_boletin}
                </span>
              )}
            </div>
            {campania.comentario && (
              <p className="text-sm text-gray-500 mt-2">{campania.comentario}</p>
            )}
          </div>
          <Badge variant={campania.estado === 'activo' ? 'success' : 'warning'}>
            {campania.estado === 'activo' ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </Card>

      <Card className="p-0">
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
                activeTab === tab.key
                  ? 'text-honda-red border-b-2 border-honda-red'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className={`fa-solid ${tab.icon} mr-2`}></i>{tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'pendientes' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">VIN</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Matricula</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Fecha Venta</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Cliente</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Estado</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendientes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-12">No hay vehiculos pendientes.</td>
                  </tr>
                ) : (
                  pendientes.map((v) => (
                    <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{v.vehiculo?.nro_chassis ?? v.nro_chassis}</td>
                      <td className="px-4 py-3 text-gray-700">{v.vehiculo?.matricula ?? v.matricula ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(v.vehiculo?.fecha_venta ?? v.fecha_venta)}</td>
                      <td className="px-4 py-3 text-gray-700">{v.vehiculo?.cliente?.razon_social ?? v.cliente ?? '-'}</td>
                      <td className="px-4 py-3"><Badge variant="warning">Pendiente</Badge></td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="primary" onClick={() => handleMarcarRealizado(v)}>
                          <i className="fa-solid fa-check mr-1"></i>Marcar Realizado
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'facturados' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">VIN</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Matricula</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Fecha Realizacion</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">N OT</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Fecha Facturacion</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Monto</th>
                </tr>
              </thead>
              <tbody>
                {facturados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-12">No hay vehiculos facturados.</td>
                  </tr>
                ) : (
                  facturados.map((v) => (
                    <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{v.vehiculo?.nro_chassis ?? v.nro_chassis}</td>
                      <td className="px-4 py-3 text-gray-700">{v.vehiculo?.matricula ?? v.matricula ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(v.fecha_realizacion)}</td>
                      <td className="px-4 py-3 text-gray-700">{v.numero_ot ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(v.fecha_facturacion)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatPYG(v.monto)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'articulos' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Codigo</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Descripcion</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Tipo</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Cantidad</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Precio</th>
                </tr>
              </thead>
              <tbody>
                {articulos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-12">No hay articulos registrados.</td>
                  </tr>
                ) : (
                  articulos.map((a, i) => (
                    <tr key={a.id ?? i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{a.codigo}</td>
                      <td className="px-4 py-3 text-gray-700">{a.descripcion}</td>
                      <td className="px-4 py-3 text-gray-700">{a.tipo}</td>
                      <td className="px-4 py-3 text-gray-700">{a.cantidad}</td>
                      <td className="px-4 py-3 text-gray-700">{formatPYG(a.precio)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Marcar como Realizado">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Numero OT
            </label>
            <input
              type="text"
              value={formData.numero_ot}
              onChange={(e) => setFormData((f) => ({ ...f, numero_ot: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-honda-red"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Fecha Realizacion
            </label>
            <input
              type="date"
              value={formData.fecha_realizacion}
              onChange={(e) => setFormData((f) => ({ ...f, fecha_realizacion: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-honda-red"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Guardando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
