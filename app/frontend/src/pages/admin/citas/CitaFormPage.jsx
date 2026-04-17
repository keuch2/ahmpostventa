import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCita, createCita, updateCita } from '../../../services/cita.admin.service';
import { getClientes } from '../../../services/cliente.admin.service';
import { getVehiculos } from '../../../services/vehiculo.admin.service';
import { getKits } from '../../../services/kit.service';

const createSchema = z.object({
  cliente_id: z.coerce.number().min(1, 'Selecciona un cliente'),
  vehiculo_id: z.coerce.number().min(1, 'Selecciona un vehículo'),
  tipo_servicio: z.string().min(1, 'Requerido'),
  fecha_solicitada: z.string().min(1, 'Requerido'),
  kilometraje: z.coerce.number().min(0).optional().or(z.literal('')),
  comentarios: z.string().optional(),
  kit_service_id: z.coerce.number().optional().or(z.literal('')),
  estado: z.string().optional(),
});

const editSchema = z.object({
  tipo_servicio: z.string().min(1, 'Requerido'),
  fecha_solicitada: z.string().min(1, 'Requerido'),
  fecha_confirmada: z.string().optional(),
  estado: z.string().min(1, 'Requerido'),
  kilometraje: z.coerce.number().min(0).optional().or(z.literal('')),
  comentarios: z.string().optional(),
});

const TIPO_SERVICIO_OPTIONS = ['mantenimiento', 'revision', 'recall', 'reparacion'];
const ESTADO_OPTIONS = ['solicitada', 'confirmada', 'en_proceso', 'completada', 'cancelada'];

export default function CitaFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { data: citaData, isLoading: loadingCita } = useQuery({
    queryKey: ['admin-cita', id],
    queryFn: () => getCita(id),
    enabled: isEdit,
  });

  const { data: clientesData } = useQuery({
    queryKey: ['admin-clientes-select'],
    queryFn: () => getClientes({ per_page: 100 }),
    enabled: !isEdit,
  });

  const { data: vehiculosData } = useQuery({
    queryKey: ['admin-vehiculos-select'],
    queryFn: () => getVehiculos({ per_page: 100 }),
    enabled: !isEdit,
  });

  const { data: kitsData } = useQuery({
    queryKey: ['admin-kits-select'],
    queryFn: () => getKits({ per_page: 100 }),
    enabled: !isEdit,
  });

  const clientes = clientesData?.data?.data || [];
  const vehiculos = vehiculosData?.data?.data || [];
  const kits = kitsData?.data?.data || [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: { estado: 'solicitada' },
  });

  useEffect(() => {
    if (citaData?.data) {
      const c = citaData.data;
      reset({
        tipo_servicio: c.tipo_servicio || '',
        fecha_solicitada: c.fecha_solicitada ? c.fecha_solicitada.substring(0, 10) : '',
        fecha_confirmada: c.fecha_confirmada ? c.fecha_confirmada.substring(0, 10) : '',
        estado: c.estado || 'solicitada',
        kilometraje: c.kilometraje || '',
        comentarios: c.comentarios || '',
      });
    }
  }, [citaData, reset]);

  const mutation = useMutation({
    mutationFn: (values) => isEdit ? updateCita(id, values) : createCita(values),
    onSuccess: () => navigate('/admin/citas'),
    onError: (err) => setServerError(err?.message || err?.error || 'Error al guardar la cita.'),
  });

  const onSubmit = (values) => {
    setServerError('');
    const payload = { ...values };
    if (!payload.kilometraje && payload.kilometraje !== 0) delete payload.kilometraje;
    if (!payload.kit_service_id) delete payload.kit_service_id;
    if (!payload.fecha_confirmada) delete payload.fecha_confirmada;
    mutation.mutate(payload);
  };

  if (isEdit && loadingCita) return <div className="p-6 text-gray-400 text-sm">Cargando...</div>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <Link to="/admin/citas" className="text-sm text-gray-500 hover:text-gray-700">← Volver</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">
          {isEdit ? `Editar cita #${id}` : 'Nueva cita'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        {!isEdit && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
              <select {...register('cliente_id')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
                <option value="">-- Seleccionar cliente --</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.razon_social}</option>
                ))}
              </select>
              {errors.cliente_id && <p className="text-xs text-red-500 mt-1">{errors.cliente_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo *</label>
              <select {...register('vehiculo_id')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
                <option value="">-- Seleccionar vehículo --</option>
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.nro_chassis}{v.matricula ? ` - ${v.matricula}` : ''}</option>
                ))}
              </select>
              {errors.vehiculo_id && <p className="text-xs text-red-500 mt-1">{errors.vehiculo_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kit de servicio</label>
              <select {...register('kit_service_id')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
                <option value="">-- Sin kit --</option>
                {kits.map(k => (
                  <option key={k.id} value={k.id}>{k.codigo_combo} - {k.descripcion || k.kilometraje + ' km'}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de servicio *</label>
            <select {...register('tipo_servicio')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
              <option value="">-- Seleccionar --</option>
              {TIPO_SERVICIO_OPTIONS.map(t => (
                <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            {errors.tipo_servicio && <p className="text-xs text-red-500 mt-1">{errors.tipo_servicio.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha solicitada *</label>
            <input {...register('fecha_solicitada')} type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
            {errors.fecha_solicitada && <p className="text-xs text-red-500 mt-1">{errors.fecha_solicitada.message}</p>}
          </div>
        </div>

        {isEdit && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
              <select {...register('estado')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red bg-white">
                {ESTADO_OPTIONS.map(e => (
                  <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1).replace('_', ' ')}</option>
                ))}
              </select>
              {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha confirmada</label>
              <input {...register('fecha_confirmada')} type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje</label>
          <input {...register('kilometraje')} type="number" min="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red" />
          {errors.kilometraje && <p className="text-xs text-red-500 mt-1">{errors.kilometraje.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
          <textarea
            {...register('comentarios')}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-honda-red resize-none"
          />
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
            {mutation.isPending ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear cita')}
          </button>
          <Link to="/admin/citas" className="text-sm px-5 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
