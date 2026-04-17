import api from './api';

export const getKits = (params) => api.get('/admin/kits-service', { params });
export const getKit = (id) => api.get(`/admin/kits-service/${id}`);
export const createKit = (data) => api.post('/admin/kits-service', data);
export const updateKit = (id, data) => api.put(`/admin/kits-service/${id}`, data);
export const deleteKit = (id) => api.delete(`/admin/kits-service/${id}`);
