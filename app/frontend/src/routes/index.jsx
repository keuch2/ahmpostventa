import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import { useAuth } from '../context/AuthContext';

// Public pages
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Client pages
import MiGarajePage from '../pages/cliente/MiGarajePage';
import DetalleVehiculoPage from '../pages/cliente/DetalleVehiculoPage';
import RecallsPage from '../pages/cliente/RecallsPage';
import KitServicePage from '../pages/cliente/KitServicePage';
import AgendarCitaPage from '../pages/cliente/AgendarCitaPage';

// Admin pages
import DashboardPage from '../pages/admin/DashboardPage';
import CampaniasListPage from '../pages/admin/campanias/CampaniasListPage';
import CampaniaDetailPage from '../pages/admin/campanias/CampaniaDetailPage';
import KitsListPage from '../pages/admin/kits/KitsListPage';
import KitDetailPage from '../pages/admin/kits/KitDetailPage';
import CitasAdminPage from '../pages/admin/citas/CitasAdminPage';
import UsuariosListPage from '../pages/admin/usuarios/UsuariosListPage';
import UsuarioFormPage from '../pages/admin/usuarios/UsuarioFormPage';
import VehiculosAdminPage from '../pages/admin/vehiculos/VehiculosAdminPage';
import ClientesAdminPage from '../pages/admin/clientes/ClientesAdminPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-honda-red"></div></div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-honda-red"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/mi-garaje" />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>

      {/* Client - authenticated */}
      <Route element={<PrivateRoute><PublicLayout /></PrivateRoute>}>
        <Route path="/mi-garaje" element={<MiGarajePage />} />
        <Route path="/vehiculo/:id" element={<DetalleVehiculoPage />} />
        <Route path="/vehiculo/:id/recalls" element={<RecallsPage />} />
        <Route path="/vehiculo/:id/mantenimiento" element={<KitServicePage />} />
        <Route path="/agendar-cita" element={<AgendarCitaPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="campanias" element={<CampaniasListPage />} />
        <Route path="campanias/:id" element={<CampaniaDetailPage />} />
        <Route path="kits-service" element={<KitsListPage />} />
        <Route path="kits-service/:id" element={<KitDetailPage />} />
        <Route path="vehiculos" element={<VehiculosAdminPage />} />
        <Route path="clientes" element={<ClientesAdminPage />} />
        <Route path="citas" element={<CitasAdminPage />} />
        <Route path="usuarios" element={<UsuariosListPage />} />
        <Route path="usuarios/nuevo" element={<UsuarioFormPage />} />
        <Route path="usuarios/:id/editar" element={<UsuarioFormPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
