import api from './api';

export const adminService = {
  dashboard: () => api.get('/admin/dashboard'),
  // Vehiculos admin
  vehiculos: {
    list: (params) => api.get('/admin/vehiculos', { params }),
    show: (id) => api.get(`/admin/vehiculos/${id}`),
    create: (data) => api.post('/admin/vehiculos', data),
    update: (id, data) => api.put(`/admin/vehiculos/${id}`, data),
    destroy: (id) => api.delete(`/admin/vehiculos/${id}`),
  },
  // Clientes admin
  clientes: {
    list: (params) => api.get('/admin/clientes', { params }),
    show: (id) => api.get(`/admin/clientes/${id}`),
    create: (data) => api.post('/admin/clientes', data),
    update: (id, data) => api.put(`/admin/clientes/${id}`, data),
    destroy: (id) => api.delete(`/admin/clientes/${id}`),
  },
};
