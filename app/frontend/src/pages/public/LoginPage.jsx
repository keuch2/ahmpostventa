import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate('/mi-garaje');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 mb-12 p-8 bg-white card-shadow rounded-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Iniciar sesion</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm mb-5">
          <i className="fa-solid fa-circle-exclamation mr-2"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Correo electronico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
        <Input
          label="Contrasena"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />
        <button type="submit" disabled={loading} className="btn-honda w-full px-6 py-3 text-sm">
          {loading ? 'INGRESANDO...' : 'INICIAR SESION'}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 text-center">
        No tienes cuenta?{' '}
        <Link to="/registro" className="text-red-600 font-bold hover:text-red-700 transition-colors">
          Registrate
        </Link>
      </p>
    </div>
  );
}
