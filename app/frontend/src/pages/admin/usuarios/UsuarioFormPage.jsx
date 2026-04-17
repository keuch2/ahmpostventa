import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUsuario, createUsuario, updateUsuario } from '../../../services/usuario.service';

const baseSchema = {
  nombre: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'superadmin']),
  telefono: z.string().optional(),
  celular: z.string().optional(),
  activo: z.boolean().optional(),
};

const createSchema = z.object({ ...baseSchema, password: z.string().min(8, 'Mínimo 8 caracteres') });
const editSchema = z.object({ ...baseSchema, password: z.string().min(8).optional().or(z.literal('')) });

export default function UsuarioFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-usuario', id],
    queryFn: () => getUsuario(id),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: { role: 'admin', activo: true },
  });

  useEffect(() => {
    if (data?.data) {
      const u = data.data;
      reset({ nombre: u.nombre, email: u.email, role: u.role, telefono: u.telefono || '', celular: u.celular || '', activo: u.activo, password: '' });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (values) => isEdit ? updateUsuario(id, values) : createUsuario(values),
    onSuccess: () => navigate('/admin/usuarios'),
  });

  const onSubmit = (values) => {
    if (isEdit && !values.password) delete values.password;
    mutation.mutate(values);
  };

  if (isEdit && isLoading) return <div className="p-6 text-gray-400 text-sm">Cargando...</div>;

  return (
    <div className="p-6 max-w-lg">
      <div className="mb-6">
        <Link to="/admin/usuarios" className="text-sm text-gray-500 hover:text-gray-700">← Volver</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">
          {isEdit ? 'Editar usuario' : 'Nuevo usuario admin'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input {...register('nombre')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input {...register('email')} type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isEdit ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
          </label>
          <input {...register('password')} type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <select {...register('role')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input {...register('telefono')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
            <input {...register('celular')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input {...register('activo')} type="checkbox" id="activo" className="rounded border-gray-300 text-honda-red focus:ring-honda-red" />
          <label htmlFor="activo" className="text-sm text-gray-700">Usuario activo</label>
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-500">{mutation.error?.message || 'Error al guardar'}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-honda-red text-white text-sm px-5 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear usuario')}
          </button>
          <Link to="/admin/usuarios" className="text-sm px-5 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
