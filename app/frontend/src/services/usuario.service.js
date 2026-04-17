import api from './api';

export const getUsuarios = (params) => api.get('/admin/usuarios', { params });
export const getUsuario = (id) => api.get(`/admin/usuarios/${id}`);
export const createUsuario = (data) => api.post('/admin/usuarios', data);
export const updateUsuario = (id, data) => api.put(`/admin/usuarios/${id}`, data);
export const deleteUsuario = (id) => api.delete(`/admin/usuarios/${id}`);
