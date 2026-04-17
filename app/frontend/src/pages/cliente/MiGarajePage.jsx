import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMisVehiculos, useVehiculoCampanias } from '../../hooks/useVehiculo';
import { useNavigate, Link } from 'react-router-dom';
import { truncateVIN, formatDate } from '../../utils/formatters';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

export default function MiGarajePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: vehiculosRes, isLoading } = useMisVehiculos();
  const vehiculos = vehiculosRes?.data || [];

  const [activeVehicleIdx, setActiveVehicleIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('recalls');

  const vehiculo = vehiculos[activeVehicleIdx] || null;
  const vehiculoId = vehiculo?.id;

  const { data: campaniasRes } = useVehiculoCampanias(vehiculoId);
  const campanias = campaniasRes?.data || [];
  const pendingRecalls = campanias.filter((c) => c.estado === 'pendiente');

  if (isLoading) return <Spinner />;

  const tabs = [
    { key: 'recalls', label: 'Recalls de Seguridad', count: pendingRecalls.length },
    { key: 'mantenimiento', label: 'Mantenimiento' },
    { key: 'manual', label: 'Manual de Usuario' },
    { key: 'historial', label: 'Historial' },
  ];

  return (
    <div>
      {/* Section Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Mi cuenta</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, <span className="text-red-700">{user?.nombre}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona tus vehiculos, servicios y mas desde un solo lugar.</p>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Vehicles Card */}
          <div className="bg-white card-shadow rounded-sm p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Mis Productos</h3>
            <div className="space-y-2">
              {vehiculos.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => { setActiveVehicleIdx(idx); setActiveTab('recalls'); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-sm text-left transition-all cursor-pointer bg-white border ${
                    idx === activeVehicleIdx ? 'border-2 border-red-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 vehicle-placeholder rounded-sm flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-car text-gray-400 text-sm"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{v.anio} {v.modelo}</p>
                    <p className="text-xs text-gray-400 font-mono">{truncateVIN(v.vin)}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/mi-garaje/agregar')}
              className="w-full mt-3 border-2 border-dashed border-gray-300 text-gray-400 text-xs font-bold uppercase tracking-wide py-3 rounded-sm hover:border-gray-400 hover:text-gray-500 transition-all cursor-pointer bg-transparent"
            >
              <i className="fa-solid fa-plus mr-1"></i> Agregar vehiculo
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white card-shadow rounded-sm p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Accesos rapidos</h3>
            <nav className="space-y-1">
              {[
                { icon: 'fa-calendar-check', label: 'Agendar servicio', to: '/agendar-cita' },
                { icon: 'fa-triangle-exclamation', label: 'Recalls', to: vehiculoId ? `/vehiculos/${vehiculoId}/recalls` : '#', badge: pendingRecalls.length },
                { icon: 'fa-book-open', label: 'Manual', to: '#' },
                { icon: 'fa-user', label: 'Mi perfil', to: '/perfil' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all no-underline"
                >
                  <i className={`fa-solid ${link.icon} w-4 text-center text-gray-400`}></i>
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{link.badge}</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {!vehiculo ? (
            <div className="bg-white card-shadow rounded-sm p-12 text-center">
              <i className="fa-solid fa-car text-5xl text-gray-300 mb-4"></i>
              <h2 className="text-lg font-bold text-gray-900 mb-2">No tienes vehiculos registrados</h2>
              <p className="text-sm text-gray-500 mb-6">Agrega tu Honda para acceder a toda su informacion.</p>
              <button onClick={() => navigate('/mi-garaje/agregar')} className="btn-honda px-6 py-3 text-sm">
                AGREGAR VEHICULO
              </button>
            </div>
          ) : (
            <>
              {/* Vehicle Card */}
              <div className="bg-white card-shadow rounded-sm overflow-hidden">
                <div className="grid md:grid-cols-5">
                  <div className="md:col-span-2 vehicle-placeholder min-h-[220px] flex flex-col items-center justify-center">
                    <i className="fa-solid fa-car-side text-6xl text-gray-300 mb-3"></i>
                    <span className="text-gray-400 text-sm">{vehiculo.modelo}</span>
                  </div>
                  <div className="md:col-span-3 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{vehiculo.anio} Honda {vehiculo.modelo}</h2>
                    <p className="text-sm text-gray-500 mb-2">{vehiculo.trim || 'Trim no especificado'}</p>
                    <p className="text-xs text-gray-400 font-mono tracking-wider mb-4">VIN: {vehiculo.vin}</p>

                    {pendingRecalls.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-300 rounded-sm px-4 py-2.5 mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-triangle-exclamation text-yellow-600"></i>
                        <span className="text-sm text-yellow-800 font-medium">
                          {pendingRecalls.length} recall{pendingRecalls.length > 1 ? 's' : ''} pendiente{pendingRecalls.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="text-center p-3 bg-gray-50 rounded-sm">
                        <p className="text-lg font-bold text-gray-900">{vehiculo.kilometraje ? vehiculo.kilometraje.toLocaleString() : '---'}</p>
                        <p className="text-xs text-gray-400">Km</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-sm">
                        <p className="text-lg font-bold text-gray-900">{vehiculo.anio}</p>
                        <p className="text-xs text-gray-400">Ano</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-sm">
                        <p className="text-lg font-bold text-gray-900">{pendingRecalls.length}</p>
                        <p className="text-xs text-gray-400">Recalls</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => navigate('/agendar-cita')} className="btn-honda px-5 py-2.5 text-xs">
                        AGENDAR SERVICIO
                      </button>
                      <button onClick={() => navigate(`/vehiculos/${vehiculoId}/recalls`)} className="btn-honda-outline px-5 py-2.5 text-xs">
                        VER DETALLES
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Card */}
              <div className="bg-white card-shadow rounded-sm">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`tab-btn px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${
                        activeTab === tab.key ? 'active text-red-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{tab.count}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* Recalls Tab */}
                  {activeTab === 'recalls' && (
                    <div>
                      {pendingRecalls.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-300 rounded-sm px-4 py-3 mb-5 flex items-start gap-3">
                          <i className="fa-solid fa-triangle-exclamation text-yellow-600 mt-0.5"></i>
                          <div>
                            <p className="text-sm font-bold text-yellow-800">Atencion: Recalls pendientes</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              Tu vehiculo tiene {pendingRecalls.length} recall{pendingRecalls.length > 1 ? 's' : ''} de seguridad pendiente{pendingRecalls.length > 1 ? 's' : ''}. Te recomendamos actuar a la brevedad.
                            </p>
                          </div>
                        </div>
                      )}
                      {campanias.length === 0 ? (
                        <div className="text-center py-8">
                          <i className="fa-solid fa-circle-check text-4xl text-green-500 mb-3"></i>
                          <p className="text-sm font-bold text-gray-900">Sin recalls activos</p>
                          <p className="text-xs text-gray-500 mt-1">Tu vehiculo no tiene campanias de seguridad pendientes.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {campanias.map((c) => (
                            <div key={c.id} className={`recall-card ${c.estado === 'pendiente' ? 'pending' : 'done'} bg-gray-50 rounded-sm p-4`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Badge variant={c.estado === 'pendiente' ? 'danger' : 'success'}>
                                    {c.estado === 'pendiente' ? 'PENDIENTE' : 'REALIZADO'}
                                  </Badge>
                                  <span className="text-sm font-medium text-gray-900">{c.tipo_campania} - {c.descripcion}</span>
                                </div>
                                <Link to={`/vehiculos/${vehiculoId}/recalls`} className="text-gray-400 hover:text-gray-600 transition-colors">
                                  <i className="fa-solid fa-chevron-right text-sm"></i>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {campanias.length > 0 && (
                        <div className="mt-4">
                          <Link to={`/vehiculos/${vehiculoId}/recalls`} className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors no-underline">
                            Ver todos los recalls <span className="ml-1">&rarr;</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mantenimiento Tab */}
                  {activeTab === 'mantenimiento' && (
                    <div className="text-center py-8">
                      <i className="fa-solid fa-oil-can text-4xl text-gray-300 mb-3"></i>
                      <p className="text-sm font-bold text-gray-900 mb-2">Mantenimiento programado</p>
                      <p className="text-xs text-gray-500 mb-5">Consulta el kit de servicio recomendado para tu vehiculo.</p>
                      <button onClick={() => navigate(`/vehiculos/${vehiculoId}/kit-service`)} className="btn-honda px-6 py-2.5 text-xs">
                        VER MANTENIMIENTO PROGRAMADO
                      </button>
                    </div>
                  )}

                  {/* Manual Tab */}
                  {activeTab === 'manual' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { icon: 'fa-book', title: 'Manual del propietario', desc: 'Guia completa de uso y mantenimiento.' },
                        { icon: 'fa-screwdriver-wrench', title: 'Guia de mantenimiento', desc: 'Intervalos y procedimientos recomendados.' },
                        { icon: 'fa-gauge-high', title: 'Especificaciones tecnicas', desc: 'Datos tecnicos y capacidades.' },
                        { icon: 'fa-shield-halved', title: 'Garantia', desc: 'Terminos y cobertura de garantia.' },
                      ].map((item) => (
                        <div key={item.title} className="border border-gray-200 rounded-sm p-4 hover:border-gray-300 transition-colors cursor-pointer">
                          <i className={`fa-solid ${item.icon} text-gray-400 text-xl mb-3`}></i>
                          <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Historial Tab */}
                  {activeTab === 'historial' && (
                    <div>
                      {[
                        { fecha: '2024-08-15', tipo: 'Mantenimiento preventivo', km: '45,000', sucursal: 'Honda Asuncion' },
                        { fecha: '2024-03-10', tipo: 'Cambio de aceite', km: '40,000', sucursal: 'Honda Asuncion' },
                        { fecha: '2023-11-22', tipo: 'Recall - Airbag', km: '35,000', sucursal: 'Honda Luque' },
                      ].map((item, idx) => (
                        <div key={idx} className={`flex items-center gap-4 py-4 ${idx > 0 ? 'border-t border-gray-100' : ''}`}>
                          <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-wrench text-gray-400 text-sm"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{item.tipo}</p>
                            <p className="text-xs text-gray-400">{item.sucursal} &middot; {item.km} km</p>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(item.fecha)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
