import api from './api';

export const campaniaService = {
  // Admin
  list: (params) => api.get('/admin/campanias', { params }),
  show: (id) => api.get(`/admin/campanias/${id}`),
  create: (data) => api.post('/admin/campanias', data),
  update: (id, data) => api.put(`/admin/campanias/${id}`, data),
  destroy: (id) => api.delete(`/admin/campanias/${id}`),
  actualizarVehiculo: (campaniaId, vehiculoId, data) => api.put(`/admin/campanias/${campaniaId}/vehiculos/${vehiculoId}`, data),
  importarChassis: (id, chassisList) => api.post(`/admin/campanias/${id}/importar-chassis`, { chassis_list: chassisList }),
};
