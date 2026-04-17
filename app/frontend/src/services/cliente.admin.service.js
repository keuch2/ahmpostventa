import api from './api';

export const getClientes = (params) => api.get('/admin/clientes', { params });
export const getCliente = (id) => api.get(`/admin/clientes/${id}`);
