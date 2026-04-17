import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { citaService } from '../../services/cita.service';
import { useMisVehiculos } from '../../hooks/useVehiculo';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const schema = z.object({
  vehiculo_id: z.string().min(1, 'Selecciona un vehiculo'),
  tipo_servicio: z.string().min(1, 'Selecciona el tipo de servicio'),
  fecha_solicitada: z.string().min(1, 'Selecciona una fecha').refine((val) => {
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today;
  }, 'La fecha debe ser futura'),
  kilometraje: z.string().min(1, 'Ingresa el kilometraje').refine((val) => parseInt(val, 10) > 0, 'Debe ser mayor a 0'),
  comentarios: z.string().optional(),
});

export default function AgendarCitaPage() {
  const { data: vehiculosRes, isLoading: loadingVeh } = useMisVehiculos();
  const vehiculos = vehiculosRes?.data || [];

  const [showSuccess, setShowSuccess] = useState(false);
  const [citaCreada, setCitaCreada] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      vehiculo_id: '',
      tipo_servicio: '',
      fecha_solicitada: '',
      kilometraje: '',
      comentarios: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => citaService.create({
      ...data,
      vehiculo_id: parseInt(data.vehiculo_id, 10),
      kilometraje: parseInt(data.kilometraje, 10),
    }),
    onSuccess: (res) => {
      setCitaCreada(res.data);
      setShowSuccess(true);
      reset();
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (loadingVeh) return <Spinner />;

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-gray-600 transition-colors no-underline text-gray-400">Inicio</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <Link to="/mi-garaje" className="hover:text-gray-600 transition-colors no-underline text-gray-400">Mi Garaje</Link>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-gray-700 font-medium">Agendar Cita</span>
          </nav>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Servicio</p>
          <h1 className="text-2xl font-bold text-gray-900">Agendar cita de servicio</h1>
          <p className="text-sm text-gray-500 mt-1">Completa el formulario para solicitar una cita en tu concesionario Honda.</p>
        </div>

        {/* Form */}
        <div className="bg-white card-shadow rounded-sm p-6">
          {mutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm mb-5">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {mutation.error?.response?.data?.message || mutation.error?.message || 'Error al crear la cita. Intenta de nuevo.'}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Select
              label="Vehiculo"
              {...register('vehiculo_id')}
              error={errors.vehiculo_id?.message}
            >
              <option value="">Selecciona tu vehiculo</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.anio} Honda {v.modelo} — {v.vin}
                </option>
              ))}
            </Select>

            <Select
              label="Tipo de servicio"
              {...register('tipo_servicio')}
              error={errors.tipo_servicio?.message}
            >
              <option value="">Selecciona el tipo</option>
              <option value="Mantenimiento preventivo">Mantenimiento preventivo</option>
              <option value="Recall/Campana">Recall / Campana</option>
              <option value="Reparacion general">Reparacion general</option>
              <option value="Diagnostico">Diagnostico</option>
            </Select>

            <Input
              label="Fecha solicitada"
              type="date"
              min={minDate}
              {...register('fecha_solicitada')}
              error={errors.fecha_solicitada?.message}
            />

            <Input
              label="Kilometraje actual"
              type="number"
              placeholder="Ej: 45000"
              {...register('kilometraje')}
              error={errors.kilometraje?.message}
            />

            <div className="w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Comentarios <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <textarea
                {...register('comentarios')}
                rows={4}
                placeholder="Describe brevemente el motivo de tu visita o algun detalle adicional..."
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-gray-900 rounded-sm transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-honda w-full px-6 py-3 text-sm"
            >
              {mutation.isPending ? 'AGENDANDO...' : 'AGENDAR CITA'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)} title="Cita agendada">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-circle-check text-green-600 text-3xl"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Cita registrada exitosamente</h3>
          <p className="text-sm text-gray-500 mb-4">
            Tu solicitud ha sido recibida. Te notificaremos cuando sea confirmada.
          </p>
          {citaCreada && (
            <div className="bg-gray-50 rounded-sm px-4 py-3 mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Numero de cita</p>
              <p className="text-lg font-bold font-mono text-gray-900">#{citaCreada.id || citaCreada.numero}</p>
            </div>
          )}
          <Link
            to="/mi-garaje"
            className="btn-honda inline-block px-6 py-2.5 text-xs no-underline"
            onClick={() => setShowSuccess(false)}
          >
            IR A MI GARAJE
          </Link>
        </div>
      </Modal>
    </div>
  );
}
