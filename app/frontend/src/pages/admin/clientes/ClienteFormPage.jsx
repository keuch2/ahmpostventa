import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCliente, createCliente, updateCliente } from '../../../services/cliente.admin.service';

const schema = z.object({
  razon_social: z.string().min(1, 'Requerido'),
  ruc_ci: z.string().optional(),
  telefono: z.string().optional(),
  celular: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
  codigo_cliente: z.string().optional(),
});

export default function ClienteFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-cliente', id],
    queryFn: () => getCliente(id),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (data?.data) {
      const c = data.data;
      reset({
        razon_social: c.razon_social || '',
        ruc_ci: c.ruc_ci || '',
        telefono: c.telefono || '',
        celular: c.celular || '',
        email: c.email || '',
        direccion: c.direccion || '',
        codigo_cliente: c.codigo_cliente || '',
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (values) => isEdit ? updateCliente(id, values) : createCliente(values),
    onSuccess: () => navigate('/admin/clientes'),
    onError: (err) => setServerError(err?.message || err?.error || 'Error al guardar el cliente.'),
  });

  const onSubmit = (values) => {
    setServerError('');
    const payload = { ...values };
    if (!payload.email) delete payload.email;
    mutation.mutate(payload);
  };

  if (isEdit && isLoading) return <div className="p-6 text-gray-400 text-sm">Cargando...</div>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <Link to="/admin/clientes" className="text-sm text-gray-500 hover:text-gray-700">← Volver</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">
          {isEdit ? 'Editar cliente' : 'Nuevo cliente'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social / Nombre *</label>
          <input {...register('razon_social')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          {errors.razon_social && <p className="text-xs text-red-500 mt-1">{errors.razon_social.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUC / CI</label>
            <input {...register('ruc_ci')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código cliente</label>
            <input {...register('codigo_cliente')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input {...register('email')} type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input {...register('direccion')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-honda-red text-white text-sm px-5 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear cliente')}
          </button>
          <Link to="/admin/clientes" className="text-sm px-5 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
