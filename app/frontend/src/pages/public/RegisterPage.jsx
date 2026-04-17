import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../components/ui/Input';
import { useState } from 'react';

const schema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Ingresa un correo valido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
  password_confirmation: z.string().min(6, 'Confirma tu contrasena'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Las contrasenas no coinciden',
  path: ['password_confirmation'],
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await authRegister(data);
      navigate('/mi-garaje');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 mb-12 p-8 bg-white card-shadow rounded-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear cuenta</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm mb-5">
          <i className="fa-solid fa-circle-exclamation mr-2"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Nombre completo"
          {...register('nombre')}
          error={errors.nombre?.message}
          placeholder="Juan Perez"
        />
        <Input
          label="Correo electronico"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="tu@email.com"
        />
        <Input
          label="Contrasena"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="Minimo 6 caracteres"
        />
        <Input
          label="Confirmar contrasena"
          type="password"
          {...register('password_confirmation')}
          error={errors.password_confirmation?.message}
          placeholder="Repite tu contrasena"
        />
        <button type="submit" disabled={loading} className="btn-honda w-full px-6 py-3 text-sm">
          {loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 text-center">
        Ya tienes cuenta?{' '}
        <Link to="/login" className="text-red-600 font-bold hover:text-red-700 transition-colors">
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}
