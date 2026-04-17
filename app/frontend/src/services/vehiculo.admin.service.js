import api from './api';

export const getVehiculos = (params) => api.get('/admin/vehiculos', { params });
export const getVehiculo = (id) => api.get(`/admin/vehiculos/${id}`);
export const createVehiculo = (data) => api.post('/admin/vehiculos', data);
export const updateVehiculo = (id, data) => api.put(`/admin/vehiculos/${id}`, data);
export const deleteVehiculo = (id) => api.delete(`/admin/vehiculos/${id}`);
export const importVehiculosCsv = (file) => {
  const form = new FormData(); form.append('file', file);
  return api.post('/admin/vehiculos/import-csv', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const getCsvTemplateUrl = () => `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/admin/vehiculos/csv-template`;
