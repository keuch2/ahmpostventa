import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kitServiceService } from '../../../services/kitservice.service';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { formatPYG } from '../../../utils/formatters';

const TABS = [
  { key: 'producto', label: 'Productos', icon: 'fa-box' },
  { key: 'servicio', label: 'Servicios', icon: 'fa-wrench' },
  { key: 'inspeccion', label: 'Inspecciones', icon: 'fa-clipboard-check' },
];

export default function KitDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('producto');

  const { data, isLoading } = useQuery({
    queryKey: ['kit', id],
    queryFn: () => kitServiceService.show(id).then((r) => r.data),
  });

  const duplicarMutation = useMutation({
    mutationFn: () => kitServiceService.duplicar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kits'] });
      alert('Combo duplicado exitosamente.');
    },
  });

  if (isLoading) return <Spinner />;

  const kit = data?.data ?? data ?? {};
  const items = kit.items ?? [];

  const productos = items.filter((i) => i.tipo === 'producto');
  const servicios = items.filter((i) => i.tipo === 'servicio');
  const inspecciones = items.filter((i) => i.tipo === 'inspeccion');

  const totalProductos = productos.reduce((sum, p) => sum + (p.precio_unitario ?? p.precio ?? 0) * (p.cantidad ?? 1), 0);
  const totalServicios = servicios.reduce((sum, s) => sum + (s.precio ?? 0), 0);
  const totalGeneral = totalProductos + totalServicios;

  const currentItems =
    activeTab === 'producto' ? productos : activeTab === 'servicio' ? servicios : inspecciones;

  return (
    <div>
      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{kit.codigo_combo}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span>
                <i className="fa-solid fa-car mr-1"></i>{kit.modelo?.nombre ?? '-'}
              </span>
              <span>
                <i className="fa-solid fa-calendar-days mr-1"></i>{kit.anio_inicio} - {kit.anio_fin}
              </span>
              <span>
                <i className="fa-solid fa-road mr-1"></i>{kit.kilometraje} km
              </span>
              {kit.express && (
                <Badge variant="success">Express</Badge>
              )}
            </div>
            {kit.descripcion && (
              <p className="text-sm text-gray-500 mt-2">{kit.descripcion}</p>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => duplicarMutation.mutate()}
            disabled={duplicarMutation.isPending}
          >
            <i className="fa-solid fa-copy mr-2"></i>
            {duplicarMutation.isPending ? 'Duplicando...' : 'Duplicar Combo'}
          </Button>
        </div>
      </Card>

      <Card className="p-0 mb-6">
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
          {activeTab === 'producto' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Codigo</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Descripcion</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Cantidad</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Precio Unitario</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-12">No hay productos.</td>
                  </tr>
                ) : (
                  currentItems.map((item, i) => (
                    <tr key={item.id ?? i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{item.codigo}</td>
                      <td className="px-4 py-3 text-gray-700">{item.descripcion}</td>
                      <td className="px-4 py-3 text-gray-700">{item.cantidad ?? 1}</td>
                      <td className="px-4 py-3 text-gray-700">{formatPYG(item.precio_unitario ?? item.precio)}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{formatPYG((item.precio_unitario ?? item.precio ?? 0) * (item.cantidad ?? 1))}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'servicio' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Codigo</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Descripcion</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Tiempo (min)</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Precio</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-12">No hay servicios.</td>
                  </tr>
                ) : (
                  currentItems.map((item, i) => (
                    <tr key={item.id ?? i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{item.codigo}</td>
                      <td className="px-4 py-3 text-gray-700">{item.descripcion}</td>
                      <td className="px-4 py-3 text-gray-700">{item.tiempo ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{formatPYG(item.precio)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'inspeccion' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Codigo</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Descripcion</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-12">No hay inspecciones.</td>
                  </tr>
                ) : (
                  currentItems.map((item, i) => (
                    <tr key={item.id ?? i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{item.codigo}</td>
                      <td className="px-4 py-3 text-gray-700">{item.descripcion}</td>
                      <td className="px-4 py-3 text-gray-700">{item.tiempo ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-end gap-6 text-sm">
          <div className="text-gray-600">
            Total Productos: <span className="font-bold text-gray-900">{formatPYG(totalProductos)}</span>
          </div>
          <div className="text-gray-600">
            Total Servicios: <span className="font-bold text-gray-900">{formatPYG(totalServicios)}</span>
          </div>
          <div className="text-gray-900 text-base font-bold">
            TOTAL GENERAL: {formatPYG(totalGeneral)}
          </div>
        </div>
      </Card>
    </div>
  );
}
