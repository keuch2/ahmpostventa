import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { AUTH_BUTTONS_VISIBLE } from '../../config/features';

const BASE = import.meta.env.BASE_URL || '/ahmpostventa/app/frontend/';

export default function PublicHeader() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user?.nombre) return '';
    const parts = user.nombre.split(' ');
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  };

  const getShortName = () => {
    if (!user?.nombre) return '';
    const parts = user.nombre.split(' ');
    return parts[0] + (parts[1] ? ` ${parts[1][0]}.` : '');
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">

      {/* Top bar — identico al prototipo */}
      <div style={{ backgroundColor: '#1A1A1A' }} className="text-white text-xs py-1.5 px-4 text-center">
        Llame al +595 21 728 5718 &nbsp;|&nbsp; Lunes a Viernes 8:00 – 17:00
      </div>

      {/* Main nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-14 gap-6">

          {/* Logo — identico al prototipo: honda_logo.png + owners_logo.svg */}
          <Link to="/" className="flex items-center gap-4 flex-shrink-0">
            <img src={`${BASE}img/honda_logo.png`} alt="Honda Paraguay" className="h-7 w-auto" />
            <img src={`${BASE}img/owners_logo.svg`} alt="Owners" className="h-5 w-auto" />
          </Link>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3">
            <button className="text-gray-600 hover:text-red-700 transition-all p-2">
              <i className="fa-solid fa-magnifying-glass text-base"></i>
            </button>
            <button className="text-sm text-gray-600 hover:text-red-700 flex items-center gap-1 transition-all">
              ES <i className="fa-solid fa-chevron-down text-xs"></i>
            </button>

            {/* Login / User button */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-700 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-bold">
                    {getInitials()}
                  </div>
                  <span className="hidden md:inline">{getShortName()}</span>
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/mi-garaje"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="fa-solid fa-car-side mr-2 text-gray-400"></i>
                      Mi Garaje
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <i className="fa-solid fa-shield-halved mr-2 text-gray-400"></i>
                        Panel Admin
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="fa-solid fa-right-from-bracket mr-2 text-gray-400"></i>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : AUTH_BUTTONS_VISIBLE ? (
              <Link to="/login" className="btn-honda text-xs px-4 py-2 flex items-center gap-2">
                <i className="fa-solid fa-user"></i> Iniciar sesión
              </Link>
            ) : null}

            {/* Mobile menu btn */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="bg-white border-b border-gray-200 md:hidden">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                <Link
                  to="/mi-garaje"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-gray-700 border-b border-gray-100"
                >
                  Mi Garaje
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-gray-700 border-b border-gray-100"
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="block py-2 text-sm text-gray-700 w-full text-left"
                >
                  Cerrar sesión
                </button>
              </>
            ) : AUTH_BUTTONS_VISIBLE ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-honda text-xs px-4 py-2 flex items-center gap-2 justify-center w-full"
              >
                <i className="fa-solid fa-user"></i> Iniciar sesión
              </Link>
            ) : null}
          </div>
        </div>
      )}

    </header>
  );
}
