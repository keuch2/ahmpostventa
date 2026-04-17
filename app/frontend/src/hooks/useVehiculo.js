import { useQuery } from '@tanstack/react-query';
import { vehiculoService } from '../services/vehiculo.service';

export function useMisVehiculos() {
  return useQuery({
    queryKey: ['mis-vehiculos'],
    queryFn: () => vehiculoService.misVehiculos(),
  });
}

export function useVehiculo(id) {
  return useQuery({
    queryKey: ['vehiculo', id],
    queryFn: () => vehiculoService.show(id),
    enabled: !!id,
  });
}

export function useVehiculoCampanias(id) {
  return useQuery({
    queryKey: ['vehiculo-campanias', id],
    queryFn: () => vehiculoService.campanias(id),
    enabled: !!id,
  });
}

export function useVehiculoKitService(id, kilometraje) {
  return useQuery({
    queryKey: ['vehiculo-kit-service', id, kilometraje],
    queryFn: () => vehiculoService.kitService(id, kilometraje),
    enabled: !!id && !!kilometraje,
  });
}
