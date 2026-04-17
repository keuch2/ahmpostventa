import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getVehiculo, createVehiculo, updateVehiculo } from '../../../services/vehiculo.admin.service';
import { getCatalogoAdmin } from '../../../services/catalogo.admin.service';

const schema = z.object({
  nro_chassis: z.string().min(1, 'Requerido'),
  matricula: z.string().optional(),
  modelo_id: z.coerce.number().min(1, 'Selecciona un modelo').optional().or(z.literal('')),
  anio: z.coerce.number().min(1990, 'Mínimo 1990').max(2030, 'Máximo 2030'),
  carroceria: z.string().optional(),
  color: z.string().optional(),
  transmision_id: z.coerce.number().optional().or(z.literal('')),
  combustible_id: z.coerce.number().optional().or(z.literal('')),
  kilometraje_actual: z.coerce.number().min(0).optional(),
  fecha_venta: z.string().optional(),
});

export default function VehiculoFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { data: vehiculoData, isLoading: loadingVehiculo } = useQuery({
    queryKey: ['admin-vehiculo', id],
    queryFn: () => getVehiculo(id),
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
    defaultValues: { kilometraje_actual: 0 },
  });

  useEffect(() => {
    if (vehiculoData?.data) {
      const v = vehiculoData.data;
      reset({
        nro_chassis: v.nro_chassis || '',
        matricula: v.matricula || '',
        modelo_id: v.modelo_id || '',
        anio: v.anio || '',
        carroceria: v.carroceria || '',
        color: v.color || '',
        transmision_id: v.transmision_id || '',
        combustible_id: v.combustible_id || '',
        kilometraje_actual: v.kilometraje_actual || 0,
        fecha_venta: v.fecha_venta ? v.fecha_venta.substring(0, 10) : '',
      });
    }
  }, [vehiculoData, reset]);

  const mutation = useMutation({
    mutationFn: (values) => isEdit ? updateVehiculo(id, values) : createVehiculo(values),
    onSuccess: () => navigate('/admin/vehiculos'),
    onError: (err) => setServerError(err?.message || err?.error || 'Error al guardar el vehículo.'),
  });

  const onSubmit = (values) => {
    setServerError('');
    const payload = { ...values };
    if (!payload.modelo_id) delete payload.modelo_id;
    if (!payload.transmision_id) delete payload.transmision_id;
    if (!payload.combustible_id) delete payload.combustible_id;
    if (!payload.fecha_venta) delete payload.fecha_venta;
    mutation.mutate(payload);
  };

  if (isEdit && loadingVehiculo) return <div className="p-6 text-gray-400 text-sm">Cargando...</div>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <Link to="/admin/vehiculos" className="text-sm text-gray-500 hover:text-gray-700">← Volver</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">
          {isEdit ? 'Editar vehículo' : 'Nuevo vehículo'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nro. Chassis *</label>
            <input {...register('nro_chassis')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
            {errors.nro_chassis && <p className="text-xs text-red-500 mt-1">{errors.nro_chassis.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
            <input {...register('matricula')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <select {...register('modelo_id')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
              <option value="">-- Seleccionar --</option>
              {modelos.map(m => (
                <option key={m.id} value={m.id}>{m.marca?.nombre} {m.nombre}</option>
              ))}
            </select>
            {errors.modelo_id && <p className="text-xs text-red-500 mt-1">{errors.modelo_id.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
            <input {...register('anio')} type="number" min="1990" max="2030" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
            {errors.anio && <p className="text-xs text-red-500 mt-1">{errors.anio.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carrocería</label>
            <input {...register('carroceria')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input {...register('color')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje actual</label>
            <input {...register('kilometraje_actual')} type="number" min="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
            {errors.kilometraje_actual && <p className="text-xs text-red-500 mt-1">{errors.kilometraje_actual.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de venta</label>
            <input {...register('fecha_venta')} type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
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
            {mutation.isPending ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear vehículo')}
          </button>
          <Link to="/admin/vehiculos" className="text-sm px-5 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
