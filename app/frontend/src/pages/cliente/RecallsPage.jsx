import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVehiculo, useVehiculoCampanias } from '../../hooks/useVehiculo';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

export default function RecallsPage() {
  const { vehiculoId } = useParams();
  const { data: vehiculoRes, isLoading: loadingVeh } = useVehiculo(vehiculoId);
  const { data: campaniasRes, isLoading: loadingCamp } = useVehiculoCampanias(vehiculoId);

  const vehiculo = vehiculoRes?.data;
  const campanias = campaniasRes?.data || [];
  const pendingCount = campanias.filter((c) => c.estado === 'pendiente').length;

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loadingVeh || loadingCamp) return <Spinner />;

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
            <span className="text-gray-700 font-medium">Recalls de Seguridad</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Alert Banner */}
        {pendingCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-sm px-5 py-4 mb-6 flex items-start gap-3">
            <i className="fa-solid fa-triangle-exclamation text-yellow-600 text-lg mt-0.5"></i>
            <div>
              <p className="text-sm font-bold text-yellow-800">
                Hay {pendingCount} recall{pendingCount > 1 ? 's' : ''} activo{pendingCount > 1 ? 's' : ''} para tu {vehiculo?.anio} {vehiculo?.modelo}.
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Contacta a tu concesionario Honda autorizado para programar la reparacion sin costo.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Seguridad del vehiculo</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Recalls de Seguridad &mdash; Honda {vehiculo?.modelo} {vehiculo?.anio}
          </h1>
        </div>

        {/* VIN Confirmation */}
        {vehiculo?.vin && (
          <div className="border border-green-300 bg-green-50 rounded-sm px-5 py-3 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-circle-check text-green-600"></i>
            <span className="text-sm text-green-800">
              VIN: <span className="font-mono tracking-wider font-medium">{vehiculo.vin}</span>
            </span>
            <span className="text-xs text-green-600 ml-2">Aplica a tu vehiculo</span>
          </div>
        )}

        {/* Recalls List */}
        {campanias.length === 0 ? (
          <div className="bg-white card-shadow rounded-sm p-12 text-center">
            <i className="fa-solid fa-circle-check text-5xl text-green-500 mb-4"></i>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Sin recalls activos</h2>
            <p className="text-sm text-gray-500">Tu vehiculo no tiene campanias de seguridad registradas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campanias.map((c) => {
              const isPending = c.estado === 'pendiente';
              const isOpen = expanded[c.id];

              return (
                <div
                  key={c.id}
                  className={`bg-white card-shadow rounded-sm overflow-hidden border-l-4 ${isPending ? 'border-l-red-600' : 'border-l-green-600'}`}
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleExpand(c.id)}
                    className="w-full flex items-center justify-between px-5 py-4 cursor-pointer bg-transparent border-none text-left"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Badge variant={isPending ? 'danger' : 'success'}>
                        {isPending ? 'PENDIENTE' : 'REALIZADO'}
                      </Badge>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{c.tipo_campania}</p>
                        <p className="text-xs text-gray-500 truncate">{c.descripcion}</p>
                      </div>
                    </div>
                    <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400 ml-4 flex-shrink-0`}></i>
                  </button>

                  {/* Body */}
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                      {c.comentario && (
                        <p className="text-sm text-gray-700 mb-4">{c.comentario}</p>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        {c.codigo_fabrica && (
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wide">Codigo Fabrica</span>
                            <p className="font-mono text-gray-900 mt-0.5">{c.codigo_fabrica}</p>
                          </div>
                        )}
                        {c.nro_boletin && (
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wide">Nro. Boletin</span>
                            <p className="font-mono text-gray-900 mt-0.5">{c.nro_boletin}</p>
                          </div>
                        )}
                        {c.fecha_inicio && (
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wide">Fecha Inicio</span>
                            <p className="text-gray-900 mt-0.5">{formatDate(c.fecha_inicio)}</p>
                          </div>
                        )}
                        {c.fecha_fin && (
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wide">Fecha Fin</span>
                            <p className="text-gray-900 mt-0.5">{formatDate(c.fecha_fin)}</p>
                          </div>
                        )}
                      </div>

                      {isPending && (
                        <div className="mt-5">
                          <Link
                            to="/agendar-cita"
                            className="btn-honda inline-block px-6 py-2.5 text-xs no-underline"
                          >
                            PROGRAMAR CITA
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
