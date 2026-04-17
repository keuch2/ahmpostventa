import api from './api';

export const getCitas = (params) => api.get('/admin/citas', { params });
export const getCita = (id) => api.get(`/admin/citas/${id}`);
export const createCita = (data) => api.post('/admin/citas', data);
export const updateCita = (id, data) => api.put(`/admin/citas/${id}`, data);
export const deleteCita = (id) => api.delete(`/admin/citas/${id}`);
