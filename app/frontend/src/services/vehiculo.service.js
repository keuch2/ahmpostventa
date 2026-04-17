import api from './api';

export const vehiculoService = {
  catalogo: () => api.get('/catalogo'),
  buscar: (vin) => api.get(`/vehiculos/buscar?vin=${vin}`),
  buscarPorModelo: (params) => api.get('/vehiculos/buscar-modelo', { params }),
  show: (id) => api.get(`/vehiculos/${id}`),
  campanias: (id) => api.get(`/vehiculos/${id}/campanias`),
  kitService: (id, kilometraje) => api.get(`/vehiculos/${id}/kit-service?kilometraje=${kilometraje}`),
  misVehiculos: () => api.get('/mis-vehiculos'),
  vincular: (id) => api.post(`/mis-vehiculos/${id}/vincular`),
};
