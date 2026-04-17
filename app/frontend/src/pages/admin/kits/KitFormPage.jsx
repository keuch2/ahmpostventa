import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getKit, createKit, updateKit } from '../../../services/kit.service';
import { getCatalogoAdmin } from '../../../services/catalogo.admin.service';

const schema = z.object({
  codigo_combo: z.string().min(1, 'Requerido'),
  modelo_id: z.coerce.number().optional().or(z.literal('')),
  codigo_grado: z.string().optional(),
  vds: z.string().optional(),
  anio_inicio: z.coerce.number().optional().or(z.literal('')),
  anio_final: z.coerce.number().optional().or(z.literal('')),
  carroceria: z.string().optional(),
  transmision_id: z.coerce.number().optional().or(z.literal('')),
  combustible_id: z.coerce.number().optional().or(z.literal('')),
  tipo_motor: z.string().optional(),
  kilometraje: z.coerce.number().min(0, 'Requerido'),
  descripcion: z.string().optional(),
  express: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export default function KitFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { data: kitData, isLoading: loadingKit } = useQuery({
    queryKey: ['admin-kit', id],
    queryFn: () => getKit(id),
    enabled: isEdit,
  });

  const { data: catalogoData } = useQuery({
    queryKey: ['catalogo-admin'],
    queryFn: getCatalogoAdmin,
  });

  const modelos = catalogoData?.data?.modelos || [];
  const transmisiones = catalogoData?.data?.transmisiones || [];
  const combustibles = catalogoData?.data?.combustibles || [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { activo: true, express: false, kilometraje: 0 },
  });

  useEffect(() => {
    if (kitData?.data) {
      const k = kitData.data;
      reset({
        codigo_combo: k.codigo_combo || '',
        modelo_id: k.modelo_id || '',
        codigo_grado: k.codigo_grado || '',
        vds: k.vds || '',
        anio_inicio: k.anio_inicio || '',
        anio_final: k.anio_final || k.anio_fin || '',
        carroceria: k.carroceria || '',
        transmision_id: k.transmision_id || '',
        combustible_id: k.combustible_id || '',
        tipo_motor: k.tipo_motor || '',
        kilometraje: k.kilometraje || 0,
        descripcion: k.descripcion || '',
        express: Boolean(k.express),
        activo: k.activo !== undefined ? Boolean(k.activo) : true,
      });
    }
  }, [kitData, reset]);

  const mutation = useMutation({
    mutationFn: (values) => isEdit ? updateKit(id, values) : createKit(values),
    onSuccess: () => navigate('/admin/kits-service'),
    onError: (err) => setServerError(err?.message || err?.error || 'Error al guardar el kit.'),
  });

  const onSubmit = (values) => {
    setServerError('');
    const payload = { ...values };
    if (!payload.modelo_id) delete payload.modelo_id;
    if (!payload.transmision_id) delete payload.transmision_id;
    if (!payload.combustible_id) delete payload.combustible_id;
    if (!payload.anio_inicio) delete payload.anio_inicio;
    if (!payload.anio_final) delete payload.anio_final;
    mutation.mutate(payload);
  };

  if (isEdit && loadingKit) return <div className="p-6 text-gray-400 text-sm">Cargando...</div>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <Link to="/admin/kits-service" className="text-sm text-gray-500 hover:text-gray-700">← Volver</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">
          {isEdit ? 'Editar Kit de Service' : 'Nuevo Kit de Service'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código Combo *</label>
            <input {...register('codigo_combo')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
            {errors.codigo_combo && <p className="text-xs text-red-500 mt-1">{errors.codigo_combo.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje *</label>
            <input {...register('kilometraje')} type="number" min="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
            {errors.kilometraje && <p className="text-xs text-red-500 mt-1">{errors.kilometraje.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
          <select {...register('modelo_id')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
            <option value="">-- Seleccionar --</option>
            {modelos.map(m => (
              <option key={m.id} value={m.id}>{m.marca?.nombre} {m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código Grado</label>
            <input {...register('codigo_grado')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VDS</label>
            <input {...register('vds')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año inicio</label>
            <input {...register('anio_inicio')} type="number" min="1990" max="2040" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año final</label>
            <input {...register('anio_final')} type="number" min="1990" max="2040" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transmisión</label>
            <select {...register('transmision_id')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
              <option value="">-- Seleccionar --</option>
              {transmisiones.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
            <select {...register('combustible_id')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
              <option value="">-- Seleccionar --</option>
              {combustibles.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carrocería</label>
            <input {...register('carroceria')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de motor</label>
            <input {...register('tipo_motor')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input {...register('descripcion')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input {...register('express')} type="checkbox" id="express" className="rounded border-gray-300 text-honda-red focus:ring-honda-red" />
            <label htmlFor="express" className="text-sm text-gray-700">Express</label>
          </div>
          <div className="flex items-center gap-2">
            <input {...register('activo')} type="checkbox" id="activo" className="rounded border-gray-300 text-honda-red focus:ring-honda-red" />
            <label htmlFor="activo" className="text-sm text-gray-700">Activo</label>
          </div>
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
            {mutation.isPending ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear kit')}
          </button>
          <Link to="/admin/kits-service" className="text-sm px-5 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
