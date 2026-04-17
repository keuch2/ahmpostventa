import api from './api';

export const citaService = {
  create: (data) => api.post('/citas', data),
  misCitas: () => api.get('/mis-citas'),
  // Admin
  list: (params) => api.get('/admin/citas', { params }),
  show: (id) => api.get(`/admin/citas/${id}`),
  update: (id, data) => api.put(`/admin/citas/${id}`, data),
};
