import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CatalogoMantenimiento from '../../components/shared/CatalogoMantenimiento';
import { AUTH_BUTTONS_VISIBLE } from '../../config/features';

const BASE = import.meta.env.BASE_URL || '/mygarage/';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAuthNav = (path) => {
    if (user) {
      navigate('/mi-garaje');
    } else {
      navigate(path);
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
          {/* Botones de acceso ocultos por ahora — ver AUTH_BUTTONS_VISIBLE en config/features.js */}
          {AUTH_BUTTONS_VISIBLE && (
            <div className="flex items-center gap-6">
              <button onClick={() => handleAuthNav('/login')} className="btn-honda px-8 py-3 text-sm">
                INICIAR SESION
              </button>
              <button onClick={() => handleAuthNav('/registro')} className="bg-transparent text-white border-none font-bold uppercase tracking-wider text-sm cursor-pointer hover:text-gray-300 transition-colors">
                REGISTRARSE
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 min-h-[320px] hidden md:block relative overflow-hidden">
          <img
            src={`${BASE}img/hondacrv.jpg`}
            alt="Honda CR-V"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Catálogo de Mantenimiento */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Accede a tu informacion</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-5">Catálogo de Mantenimiento</h2>
          <p className="text-gray-600 text-sm mb-8 max-w-2xl">
            Seleccioná tu modelo, año, versión y combustible para conocer los repuestos, la mano de obra y el precio de referencia de cada mantenimiento programado.
          </p>
          <CatalogoMantenimiento />
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
