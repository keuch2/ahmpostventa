import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehiculoService } from '../../services/vehiculo.service';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vin, setVin] = useState('');
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError, setVinError] = useState('');
  const [vinResult, setVinResult] = useState(null);
  const [ano, setAno] = useState('');
  const [modelo, setModelo] = useState('');
  const [trim, setTrim] = useState('');
  const [modeloLoading, setModeloLoading] = useState(false);
  const [modeloError, setModeloError] = useState('');
  const [modeloResults, setModeloResults] = useState(null);

  // Catálogo dinámico desde la BD
  const [catalogo, setCatalogo] = useState({ modelos: [], combinaciones: [] });
  const [catalogoLoading, setCatalogoLoading] = useState(true);

  useEffect(() => {
    vehiculoService.catalogo()
      .then((res) => setCatalogo(res.data))
      .catch(() => setCatalogo({ modelos: [], combinaciones: [] }))
      .finally(() => setCatalogoLoading(false));
  }, []);

  // Filtros en cascada — solo mostrar opciones válidas según selección actual
  const aniosDisponibles = [...new Set(
    catalogo.combinaciones
      .filter((c) => !modelo || c.modelo_id == modelo)
      .map((c) => c.anio)
  )].sort((a, b) => b - a);

  const modelosDisponibles = catalogo.modelos.filter((m) =>
    catalogo.combinaciones.some((c) =>
      c.modelo_id == m.id && (!ano || c.anio == ano)
    )
  );

  const trimsDisponibles = [...new Set(
    catalogo.combinaciones
      .filter((c) => (!ano || c.anio == ano) && (!modelo || c.modelo_id == modelo))
      .map((c) => c.carroceria)
      .filter(Boolean)
  )].sort();

  const handleAuthNav = (path) => {
    if (user) {
      navigate('/mi-garaje');
    } else {
      navigate(path);
    }
  };

  const handleModeloSearch = async () => {
    if (!ano || !modelo) {
      setModeloError('Selecciona al menos el año y modelo.');
      return;
    }
    setModeloError('');
    setModeloResults(null);
    setModeloLoading(true);
    try {
      const params = { anio: ano, modelo_id: modelo };
      if (trim) params.carroceria = trim;
      const res = await vehiculoService.buscarPorModelo(params);
      const data = res.data || [];
      setModeloResults(data);
      if (data.length === 0) {
        setModeloError('No se encontraron vehículos con esos criterios.');
      }
    } catch {
      setModeloError('Error al buscar vehículos. Intenta de nuevo.');
    } finally {
      setModeloLoading(false);
    }
  };

  const handleVinSearch = async () => {
    if (!vin || vin.trim().length === 0) {
      setVinError('Ingresa un número de VIN.');
      return;
    }
    setVinError('');
    setVinResult(null);
    setVinLoading(true);
    try {
      const res = await vehiculoService.buscar(vin.trim());
      const vehiculo = res.data;
      setVinResult(vehiculo);
      if (user) {
        navigate(`/vehiculo/${vehiculo.id}`);
      }
    } catch {
      setVinError('No se encontró un vehículo con ese VIN.');
    } finally {
      setVinLoading(false);
    }
  };

  const cards = [
    { icon: 'fa-wrench', color: 'bg-red-100 text-red-600', title: 'Programar servicio', desc: 'Agenda tu cita de mantenimiento o reparacion.', link: '/agendar-cita' },
    { icon: 'fa-triangle-exclamation', color: 'bg-yellow-100 text-yellow-600', title: 'Retiros del mercado', desc: 'Consulta si tu vehiculo tiene recalls activos.', link: '#' },
    { icon: 'fa-book-open', color: 'bg-blue-100 text-blue-600', title: 'Manual del usuario', desc: 'Accede al manual digital de tu Honda.', link: '#' },
    { icon: 'fa-cart-shopping', color: 'bg-green-100 text-green-600', title: 'Comprar repuestos', desc: 'Piezas genuinas Honda para tu vehiculo.', link: '#' },
  ];

  return (
    <div>
      {/* Hero Split */}
      <section className="flex flex-col md:flex-row" style={{ minHeight: 380 }}>
        <div className="bg-honda-black text-white flex-1 flex flex-col justify-center" style={{ padding: '56px 64px' }}>
          <h1 className="text-white mb-4" style={{ fontSize: '2.4rem', fontWeight: 400 }}>Bienvenido a Mi Garaje</h1>
          <p className="text-gray-300 text-sm font-light mb-5">
            Tu portal exclusivo para propietarios Honda. Gestiona tu vehiculo, agenda servicios y mantente al dia con la informacion mas importante.
          </p>
          <ul className="list-disc pl-5 text-gray-400 text-sm space-y-1 mb-8">
            <li>Consulta recalls y campanias de seguridad</li>
            <li>Programa tu servicio de mantenimiento</li>
            <li>Accede al historial completo de tu vehiculo</li>
          </ul>
          <div className="flex items-center gap-6">
            <button onClick={() => handleAuthNav('/login')} className="btn-honda px-8 py-3 text-sm">
              INICIAR SESION
            </button>
            <button onClick={() => handleAuthNav('/registro')} className="bg-transparent text-white border-none font-bold uppercase tracking-wider text-sm cursor-pointer hover:text-gray-300 transition-colors">
              REGISTRARSE
            </button>
          </div>
        </div>
        <div className="bg-gray-200 flex-1 min-h-[320px] vehicle-placeholder hidden md:flex flex-col items-center justify-center">
          <i className="fa-solid fa-car text-6xl text-gray-400 mb-4"></i>
          <span className="text-gray-500 font-medium tracking-wide">Honda CR-V</span>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Accede a tu informacion</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-5">Encuentra tu Honda</h2>
            <p className="text-gray-600 text-sm mb-8 max-w-md">
              Busca por modelo o ingresa tu numero de VIN para acceder a toda la informacion de tu vehiculo, incluyendo recalls y mantenimiento programado.
            </p>

            {/* Dropdowns en cascada — solo combinaciones válidas */}
            <div className="flex gap-3 mb-4">
              <select
                value={ano}
                onChange={(e) => { setAno(e.target.value); setTrim(''); setModeloResults(null); setModeloError(''); }}
                className="border border-gray-300 px-3 py-2.5 text-sm rounded-sm flex-1 bg-white"
              >
                <option value="">{catalogoLoading ? 'Cargando...' : 'Año'}</option>
                {aniosDisponibles.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={modelo}
                onChange={(e) => { setModelo(e.target.value); setTrim(''); setModeloResults(null); setModeloError(''); }}
                className="border border-gray-300 px-3 py-2.5 text-sm rounded-sm flex-1 bg-white"
              >
                <option value="">{catalogoLoading ? 'Cargando...' : 'Modelo'}</option>
                {modelosDisponibles.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
              <select
                value={trim}
                onChange={(e) => { setTrim(e.target.value); setModeloResults(null); setModeloError(''); }}
                disabled={!ano && !modelo}
                className="border border-gray-300 px-3 py-2.5 text-sm rounded-sm flex-1 bg-white disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">Trim</option>
                {trimsDisponibles.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <button onClick={handleModeloSearch} disabled={modeloLoading || catalogoLoading} className="btn-honda px-6 py-2.5 text-xs mb-2 w-full sm:w-auto">
              {modeloLoading ? 'BUSCANDO...' : 'BUSCAR'}
            </button>
            {modeloError && <p className="text-xs text-red-600 mt-1 mb-2">{modeloError}</p>}
            {modeloResults && modeloResults.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-sm">
                <div className="flex items-center gap-2 mb-3">
                  <i className="fa-solid fa-circle-check text-green-600"></i>
                  <span className="text-sm font-bold text-green-800">
                    {modeloResults.length} vehículo{modeloResults.length !== 1 ? 's' : ''} encontrado{modeloResults.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {modeloResults.map((v) => (
                    <div key={v.id} className="bg-white p-3 rounded-sm border border-gray-200 flex items-center gap-3">
                      <div className="w-12 h-8 vehicle-placeholder rounded-sm flex-shrink-0">
                        <i className="fa-solid fa-car text-gray-300"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900">
                          Honda {v.modelo?.nombre} {v.anio}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {v.carroceria || 'Sin especificar'} — {v.color || 'Sin color'}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">VIN: {v.nro_chassis}</div>
                      </div>
                      {user ? (
                        <button onClick={() => navigate(`/vehiculo/${v.id}`)} className="btn-honda text-xs px-3 py-1.5 flex-shrink-0">
                          VER
                        </button>
                      ) : (
                        <Link to="/login" className="btn-honda text-xs px-3 py-1.5 flex-shrink-0">
                          INICIAR SESIÓN
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium">&mdash; O &mdash;</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* VIN Search */}
            <div className="mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Numero de VIN
                <span className="ml-1 text-gray-400 cursor-help" title="El VIN es un codigo de 17 caracteres ubicado en el parabrisas o en la puerta del conductor.">
                  <i className="fa-solid fa-circle-info text-xs"></i>
                </span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Ingresa tu número de VIN para obtener detalles personalizados de tu vehículo.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => { setVin(e.target.value.toUpperCase()); setVinError(''); setVinResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleVinSearch()}
                  maxLength={17}
                  placeholder="Ej: 2HKRW2H8XJH123456"
                  className="flex-1 border border-gray-300 px-4 py-2.5 text-sm rounded-sm font-mono tracking-wider"
                />
                <button onClick={handleVinSearch} disabled={vinLoading} className="btn-honda px-6 py-2.5 text-sm">
                  {vinLoading ? 'BUSCANDO...' : 'BUSCAR'}
                </button>
              </div>
              {vinError && <p className="text-xs text-red-600 mt-2">{vinError}</p>}
              {vinResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-circle-check text-green-600"></i>
                    <span className="text-sm font-bold text-green-800">Vehículo encontrado</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Honda {vinResult.modelo?.nombre} {vinResult.anio}</strong> — {vinResult.color || ''}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">VIN: {vinResult.nro_chassis}</p>
                  {user ? (
                    <button onClick={() => navigate(`/vehiculo/${vinResult.id}`)} className="btn-honda text-xs px-4 py-2 mt-3">
                      VER RECALLS Y DETALLES
                    </button>
                  ) : (
                    <div className="mt-3 flex items-center gap-3">
                      <Link to="/login" className="btn-honda text-xs px-4 py-2 inline-block">
                        INICIAR SESIÓN
                      </Link>
                      <span className="text-xs text-gray-500">para vincular este vehículo a tu cuenta</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column placeholder */}
          <div className="hidden md:flex vehicle-placeholder rounded-sm min-h-[360px] flex-col items-center justify-center">
            <i className="fa-solid fa-car-side text-7xl text-gray-300 mb-4"></i>
            <span className="text-gray-400 text-sm">Selecciona tu modelo</span>
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Que deseas hacer hoy?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <Link key={card.title} to={card.link} className="bg-white p-6 card-shadow rounded-sm cursor-pointer transition-all group hover:-translate-y-0.5 no-underline">
                <div className={`w-12 h-12 rounded-sm flex items-center justify-center mb-4 ${card.color}`}>
                  <i className={`fa-solid ${card.icon} text-lg`}></i>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{card.desc}</p>
                <span className="text-xs font-bold text-red-600 group-hover:text-red-700 transition-colors">
                  Ver mas <span className="ml-1">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Strip */}
      <section className="bg-honda-black text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          {[
            { icon: 'fa-shield-halved', title: 'Garantia Honda', desc: 'Cobertura completa para tu tranquilidad.' },
            { icon: 'fa-certificate', title: 'Piezas Genuinas', desc: 'Repuestos originales con calidad garantizada.' },
            { icon: 'fa-headset', title: 'Soporte 24/7', desc: 'Asistencia disponible cuando la necesites.' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <i className={`fa-solid ${item.icon} text-red-500 text-2xl mb-3`}></i>
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
