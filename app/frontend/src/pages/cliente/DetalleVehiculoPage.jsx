import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehiculoService } from '../../services/vehiculo.service';
import { formatNumber, formatDate, formatPYG } from '../../utils/formatters';
import Spinner from '../../components/ui/Spinner';

export default function DetalleVehiculoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recalls');

  const { data: vehiculoData, isLoading: loadingVehiculo } = useQuery({
    queryKey: ['vehiculo', id],
    queryFn: () => vehiculoService.show(id),
    enabled: !!id,
  });

  const { data: campaniasData, isLoading: loadingCampanias } = useQuery({
    queryKey: ['vehiculo-campanias', id],
    queryFn: () => vehiculoService.campanias(id),
    enabled: !!id,
  });

  if (loadingVehiculo) return <Spinner size="lg" />;

  const vehiculo = vehiculoData?.data;
  if (!vehiculo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <i className="fa-solid fa-triangle-exclamation text-4xl text-gray-300 mb-4"></i>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Vehículo no encontrado</h2>
        <Link to="/mi-garaje" className="btn-honda text-xs px-6 py-2.5 inline-block mt-4">
          VOLVER A MI GARAJE
        </Link>
      </div>
    );
  }

  const campanias = campaniasData?.data || [];
  const pendingCount = campanias.filter((c) => c.estado === 'pendiente').length;
  const doneCount = campanias.filter((c) => c.estado === 'realizado').length;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-red-700">Inicio</Link>
          <i className="fa-solid fa-chevron-right text-gray-300"></i>
          <Link to="/mi-garaje" className="hover:text-red-700">Mi Garaje</Link>
          <i className="fa-solid fa-chevron-right text-gray-300"></i>
          <span className="text-gray-800 font-medium">Honda {vehiculo.modelo?.nombre} {vehiculo.anio}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Vehicle header card */}
        <div className="bg-white card-shadow rounded-sm overflow-hidden mb-6">
          <div className="grid md:grid-cols-5">

            {/* Vehicle image */}
            <div className="md:col-span-2 vehicle-placeholder h-52 md:h-auto" style={{ minHeight: 240 }}>
              <div className="text-center">
                <i className="fa-solid fa-car text-6xl text-gray-300 mb-3"></i>
                <div className="text-gray-400 text-sm font-medium">Honda {vehiculo.modelo?.nombre} {vehiculo.anio}</div>
                <div className="text-gray-300 text-xs">{vehiculo.color || 'Sin color'}</div>
              </div>
            </div>

            {/* Vehicle info */}
            <div className="md:col-span-3 p-6">
              <div className="mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Mi vehículo</div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Honda {vehiculo.modelo?.nombre} {vehiculo.anio}
                </h1>
                <div className="text-sm text-gray-500">{vehiculo.carroceria || '—'}</div>
                <div className="text-xs text-gray-400 mt-1 font-mono">VIN: {vehiculo.nro_chassis}</div>
              </div>

              {/* Recall alert */}
              {pendingCount > 0 && (
                <button
                  onClick={() => setActiveTab('recalls')}
                  className="w-full flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-3 py-2.5 mb-4 hover:bg-red-100 transition-all"
                >
                  <i className="fa-solid fa-triangle-exclamation text-red-600"></i>
                  <span className="text-sm font-semibold text-red-700">
                    {pendingCount} recall{pendingCount !== 1 ? 's' : ''} activo{pendingCount !== 1 ? 's' : ''} para tu vehículo
                  </span>
                  <span className="ml-auto text-xs text-red-600 font-bold flex items-center gap-1">
                    Ver ahora <i className="fa-solid fa-arrow-right text-xs"></i>
                  </span>
                </button>
              )}

              {/* Vehicle details grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="bg-gray-50 rounded-sm p-3 text-center">
                  <div className="text-lg font-bold text-gray-900">{formatNumber(vehiculo.kilometraje_actual)}</div>
                  <div className="text-xs text-gray-400">Km registrados</div>
                </div>
                <div className="bg-gray-50 rounded-sm p-3 text-center">
                  <div className="text-lg font-bold text-gray-900">{vehiculo.anio}</div>
                  <div className="text-xs text-gray-400">Año modelo</div>
                </div>
                <div className="bg-gray-50 rounded-sm p-3 text-center">
                  <div className={`text-lg font-bold ${pendingCount > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>{pendingCount}</div>
                  <div className="text-xs text-gray-400">Recalls pendientes</div>
                </div>
                <div className="bg-gray-50 rounded-sm p-3 text-center">
                  <div className="text-lg font-bold text-gray-900">{vehiculo.matricula || '—'}</div>
                  <div className="text-xs text-gray-400">Matrícula</div>
                </div>
              </div>

              {/* Technical details */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-5 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Marca</span>
                  <span className="font-semibold text-gray-800">{vehiculo.modelo?.marca?.nombre || 'Honda'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Modelo</span>
                  <span className="font-semibold text-gray-800">{vehiculo.modelo?.nombre || '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Transmisión</span>
                  <span className="font-semibold text-gray-800">{vehiculo.transmision?.descripcion || '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Combustible</span>
                  <span className="font-semibold text-gray-800">{vehiculo.combustible?.descripcion || '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Color</span>
                  <span className="font-semibold text-gray-800">{vehiculo.color || '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Fecha venta</span>
                  <span className="font-semibold text-gray-800">{formatDate(vehiculo.fecha_venta)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => navigate('/agendar-cita')} className="btn-honda text-xs px-5 py-2.5 flex items-center gap-2">
                  <i className="fa-solid fa-calendar-check"></i> AGENDAR SERVICIO
                </button>
                <button onClick={() => navigate(`/vehiculo/${id}/mantenimiento`)} className="btn-honda-outline text-xs px-5 py-2.5">
                  VER MANTENIMIENTO
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs card */}
        <div className="bg-white card-shadow rounded-sm">
          <div className="flex overflow-x-auto border-b border-gray-200">
            <button
              onClick={() => setActiveTab('recalls')}
              className={`tab-btn text-sm font-semibold px-5 py-4 whitespace-nowrap flex-shrink-0 transition-all ${activeTab === 'recalls' ? 'active' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="fa-solid fa-triangle-exclamation text-yellow-500 mr-1.5"></i>
              Recalls de Seguridad
              {pendingCount > 0 && (
                <span className="ml-1.5 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('mantenimiento')}
              className={`tab-btn text-sm font-semibold px-5 py-4 whitespace-nowrap flex-shrink-0 transition-all ${activeTab === 'mantenimiento' ? 'active' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="fa-solid fa-wrench mr-1.5"></i> Mantenimiento
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`tab-btn text-sm font-semibold px-5 py-4 whitespace-nowrap flex-shrink-0 transition-all ${activeTab === 'manual' ? 'active' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="fa-solid fa-book-open mr-1.5"></i> Manual
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`tab-btn text-sm font-semibold px-5 py-4 whitespace-nowrap flex-shrink-0 transition-all ${activeTab === 'historial' ? 'active' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="fa-solid fa-clock-rotate-left mr-1.5"></i> Historial
            </button>
          </div>

          {/* Tab content */}
          <div className="p-5">

            {activeTab === 'recalls' && (
              <div>
                {loadingCampanias ? (
                  <Spinner />
                ) : campanias.length === 0 ? (
                  <div className="text-center py-10">
                    <i className="fa-solid fa-shield-halved text-4xl text-green-400 mb-3"></i>
                    <p className="text-sm text-gray-600">No hay recalls para este vehículo.</p>
                  </div>
                ) : (
                  <>
                    {pendingCount > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-sm px-4 py-3 flex items-center gap-3 mb-4">
                        <i className="fa-solid fa-triangle-exclamation text-yellow-600 text-lg flex-shrink-0"></i>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-yellow-800">
                            Hay {pendingCount} recall{pendingCount !== 1 ? 's' : ''} activo{pendingCount !== 1 ? 's' : ''} para tu {vehiculo.anio} {vehiculo.modelo?.nombre}.
                          </div>
                          <div className="text-xs text-yellow-700">Consulta el taller más cercano para gestionar estos retiros.</div>
                        </div>
                        <Link to={`/vehiculo/${id}/recalls`} className="btn-honda text-xs px-4 py-2">Ver detalle</Link>
                      </div>
                    )}
                    <div className="space-y-2">
                      {campanias.map((c) => (
                        <div key={c.id} className={`recall-card ${c.estado === 'pendiente' ? 'pending' : 'done'} border border-gray-200 rounded-sm p-4 flex items-center gap-3`}>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.estado === 'pendiente' ? 'bg-red-600' : 'bg-green-600'}`}></div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-800">{c.campania?.comentario || c.campania?.tipo_campania}</div>
                            <div className="text-xs text-gray-400">
                              Código: {c.campania?.codigo_fabrica || '—'}
                              {c.campania?.nro_boletin && ` | Boletín: ${c.campania.nro_boletin}`}
                              {c.numero_ot && ` | OT: ${c.numero_ot}`}
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${c.estado === 'pendiente' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {c.estado.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'mantenimiento' && (
              <div className="text-center py-10">
                <i className="fa-solid fa-wrench text-4xl text-gray-300 mb-4"></i>
                <div className="text-gray-500 text-sm mb-4">Consulta el kit de mantenimiento para tu kilometraje actual</div>
                <button onClick={() => navigate(`/vehiculo/${id}/mantenimiento`)} className="btn-honda text-sm px-8 py-3">
                  VER MANTENIMIENTO PROGRAMADO
                </button>
              </div>
            )}

            {activeTab === 'manual' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <a href="#" className="flex items-center gap-4 p-4 border border-gray-200 rounded-sm hover:border-red-400 hover:bg-red-50 transition-all group">
                  <div className="w-10 h-10 bg-red-50 rounded-sm flex items-center justify-center group-hover:bg-red-100">
                    <i className="fa-solid fa-file-pdf text-red-600"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">Manual del Propietario</div>
                    <div className="text-xs text-gray-400">{vehiculo.modelo?.nombre} {vehiculo.anio} — Español (PDF)</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-4 p-4 border border-gray-200 rounded-sm hover:border-red-400 hover:bg-red-50 transition-all group">
                  <div className="w-10 h-10 bg-red-50 rounded-sm flex items-center justify-center group-hover:bg-red-100">
                    <i className="fa-solid fa-file-pdf text-red-600"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">Manual de Garantía</div>
                    <div className="text-xs text-gray-400">{vehiculo.modelo?.nombre} {vehiculo.anio} — Español (PDF)</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-4 p-4 border border-gray-200 rounded-sm hover:border-red-400 hover:bg-red-50 transition-all group">
                  <div className="w-10 h-10 bg-blue-50 rounded-sm flex items-center justify-center group-hover:bg-blue-100">
                    <i className="fa-solid fa-play text-blue-600"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">Guías en video</div>
                    <div className="text-xs text-gray-400">Tutoriales del vehículo</div>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-4 p-4 border border-gray-200 rounded-sm hover:border-red-400 hover:bg-red-50 transition-all group">
                  <div className="w-10 h-10 bg-gray-50 rounded-sm flex items-center justify-center group-hover:bg-gray-100">
                    <i className="fa-solid fa-book text-gray-600"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">Manual de Navegación</div>
                    <div className="text-xs text-gray-400">Honda Sensing / Audio</div>
                  </div>
                </a>
              </div>
            )}

            {activeTab === 'historial' && (
              <div>
                {doneCount === 0 ? (
                  <div className="text-center py-10">
                    <i className="fa-solid fa-clock-rotate-left text-4xl text-gray-300 mb-4"></i>
                    <p className="text-sm text-gray-500">Aún no hay servicios registrados en el historial.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {campanias.filter((c) => c.estado === 'realizado' || c.estado === 'facturado').map((c) => (
                      <div key={c.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-sm">
                        <div className="w-10 h-10 bg-green-50 rounded-sm flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-check text-green-600"></i>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-800">{c.campania?.comentario || c.campania?.tipo_campania}</div>
                          <div className="text-xs text-gray-400">
                            {formatDate(c.fecha_realizacion)} {c.numero_ot && `— OT: ${c.numero_ot}`}
                          </div>
                        </div>
                        {c.estado === 'facturado' && (
                          <div className="text-sm font-semibold text-gray-700">{formatPYG(c.monto_facturado || 0)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
