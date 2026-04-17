import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin',           icon: 'fa-chart-line',     label: 'Dashboard', end: true },
  { to: '/admin/campanias', icon: 'fa-bullhorn',       label: 'Campanias' },
  { to: '/admin/kits',      icon: 'fa-wrench',         label: 'Kits de Service' },
  { to: '/admin/vehiculos', icon: 'fa-car',            label: 'Vehiculos' },
  { to: '/admin/clientes',  icon: 'fa-users',          label: 'Clientes' },
  { to: '/admin/citas',     icon: 'fa-calendar-check', label: 'Citas' },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user
    ? `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <aside className="w-60 bg-honda-black text-white flex flex-col shrink-0 min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-wide">VICAR</h1>
        <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'border-l-4 border-honda-red bg-white/5 text-white font-bold'
                  : 'border-l-4 border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info & logout */}
      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.nombre} {user?.apellido}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors w-full"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
