import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVehiculo, useVehiculoKitService } from '../../hooks/useVehiculo';
import { formatPYG, formatNumber } from '../../utils/formatters';
import Spinner from '../../components/ui/Spinner';

export default function KitServicePage() {
  const { vehiculoId } = useParams();
  const { data: vehiculoRes, isLoading: loadingVeh } = useVehiculo(vehiculoId);
  const vehiculo = vehiculoRes?.data;

  const [km, setKm] = useState('');
  const [queryKm, setQueryKm] = useState(null);

  const { data: kitRes, isLoading: loadingKit } = useVehiculoKitService(vehiculoId, queryKm);
  const kit = kitRes?.data;

  const handleConsultar = () => {
    const val = parseInt(km, 10);
    if (val > 0) setQueryKm(val);
  };

  if (loadingVeh) return <Spinner />;

  // Build milestone list for timeline
  const milestones = [5000, 10000, 20000, 30000, 40000, 50000, 60000, 80000, 100000];
  const currentMilestone = queryKm ? milestones.reduce((prev, curr) => (queryKm >= curr ? curr : prev), milestones[0]) : null;

  const totalProductos = kit?.productos?.reduce((sum, p) => sum + (p.subtotal || p.precio * p.cantidad), 0) || 0;
  const totalServicios = kit?.servicios?.reduce((sum, s) => sum + (s.precio || 0), 0) || 0;
  const total = totalProductos + totalServicios;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-gray-600 transition-colors no-underline text-gray-400">Inicio</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <Link to="/mi-garaje" className="hover:text-gray-600 transition-colors no-underline text-gray-400">Mi Garaje</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-gray-700 font-medium">Mantenimiento</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mantenimiento programado</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Kit de Servicio &mdash; Honda {vehiculo?.modelo} {vehiculo?.anio}
          </h1>
          {vehiculo?.vin && (
            <p className="text-xs text-gray-400 font-mono tracking-wider mt-1">VIN: {vehiculo.vin}</p>
          )}
        </div>

        {/* Kilometraje Input */}
        <div className="bg-white card-shadow rounded-sm p-6 mb-6">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
            Kilometraje actual
          </label>
          <div className="flex gap-3 items-start">
            <input
              type="number"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder="Ej: 45000"
              className="border border-gray-300 px-4 py-2.5 text-sm rounded-sm w-48"
            />
            <button onClick={handleConsultar} className="btn-honda px-6 py-2.5 text-xs">
              CONSULTAR
            </button>
          </div>
        </div>

        {loadingKit && <Spinner />}

        {kit && (
          <>
            {/* Timeline */}
            <div className="bg-white card-shadow rounded-sm p-6 mb-6 overflow-x-auto">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Hitos de mantenimiento</h3>
              <div className="flex items-center min-w-[600px]">
                {milestones.map((m, idx) => {
                  const isDone = queryKm && queryKm >= m;
                  const isCurrent = m === currentMilestone;
                  return (
                    <div key={m} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`timeline-dot ${isCurrent ? 'current' : isDone ? 'done' : 'upcoming'}`}></div>
                        <span className={`text-xs mt-2 ${isDone ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                          {formatNumber(m)} km
                        </span>
                      </div>
                      {idx < milestones.length - 1 && (
                        <div className={`timeline-line mx-1 ${isDone ? 'done' : 'upcoming'}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kit Detail */}
            <div className="bg-white card-shadow rounded-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">{kit.nombre || kit.descripcion || 'Kit de Servicio'}</h2>
                {kit.codigo && <p className="text-xs text-gray-400 font-mono mt-1">Codigo: {kit.codigo}</p>}
                {kit.descripcion && kit.nombre && <p className="text-sm text-gray-600 mt-2">{kit.descripcion}</p>}
              </div>

              {/* Productos */}
              {kit.productos && kit.productos.length > 0 && (
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                    <i className="fa-solid fa-box mr-2"></i>Productos
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-xs text-gray-400 uppercase font-bold">Codigo</th>
                          <th className="text-left py-2 text-xs text-gray-400 uppercase font-bold">Descripcion</th>
                          <th className="text-center py-2 text-xs text-gray-400 uppercase font-bold">Cant.</th>
                          <th className="text-right py-2 text-xs text-gray-400 uppercase font-bold">Precio</th>
                          <th className="text-right py-2 text-xs text-gray-400 uppercase font-bold">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kit.productos.map((p, idx) => (
                          <tr key={idx} className="border-b border-gray-50">
                            <td className="py-2.5 font-mono text-xs text-gray-500">{p.codigo}</td>
                            <td className="py-2.5 text-gray-900">{p.descripcion}</td>
                            <td className="py-2.5 text-center text-gray-600">{p.cantidad}</td>
                            <td className="py-2.5 text-right text-gray-600">{formatPYG(p.precio)}</td>
                            <td className="py-2.5 text-right font-medium text-gray-900">{formatPYG(p.subtotal || p.precio * p.cantidad)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Servicios */}
              {kit.servicios && kit.servicios.length > 0 && (
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                    <i className="fa-solid fa-wrench mr-2"></i>Servicios
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-xs text-gray-400 uppercase font-bold">Descripcion</th>
                          <th className="text-center py-2 text-xs text-gray-400 uppercase font-bold">Tiempo</th>
                          <th className="text-right py-2 text-xs text-gray-400 uppercase font-bold">Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kit.servicios.map((s, idx) => (
                          <tr key={idx} className="border-b border-gray-50">
                            <td className="py-2.5 text-gray-900">{s.descripcion}</td>
                            <td className="py-2.5 text-center text-gray-600">{s.tiempo || '-'}</td>
                            <td className="py-2.5 text-right text-gray-600">{formatPYG(s.precio)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Inspecciones */}
              {kit.inspecciones && kit.inspecciones.length > 0 && (
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                    <i className="fa-solid fa-clipboard-check mr-2"></i>Inspecciones
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-xs text-gray-400 uppercase font-bold">Descripcion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kit.inspecciones.map((insp, idx) => (
                          <tr key={idx} className="border-b border-gray-50">
                            <td className="py-2.5 text-gray-900">{insp.descripcion || insp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="px-6 py-5 bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Total estimado</span>
                <span className="text-xl font-bold text-gray-900">{formatPYG(total)}</span>
              </div>
            </div>
          </>
        )}

        {!kit && !loadingKit && queryKm && (
          <div className="bg-white card-shadow rounded-sm p-12 text-center">
            <i className="fa-solid fa-circle-info text-4xl text-gray-300 mb-4"></i>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Sin datos de mantenimiento</h2>
            <p className="text-sm text-gray-500">No se encontro un kit de servicio para el kilometraje ingresado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
