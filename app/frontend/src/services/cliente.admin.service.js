import api from './api';

export const getClientes = (params) => api.get('/admin/clientes', { params });
export const getCliente = (id) => api.get(`/admin/clientes/${id}`);
export const createCliente = (data) => api.post('/admin/clientes', data);
export const updateCliente = (id, data) => api.put(`/admin/clientes/${id}`, data);
export const deleteCliente = (id) => api.delete(`/admin/clientes/${id}`);
export const importClientesCsv = (file) => {
  const form = new FormData(); form.append('file', file);
  return api.post('/admin/clientes/import-csv', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const getCsvTemplateUrl = () => `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/admin/clientes/csv-template`;
