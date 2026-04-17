import api from './api';

export const getVehiculos = (params) => api.get('/admin/vehiculos', { params });
export const getVehiculo = (id) => api.get(`/admin/vehiculos/${id}`);
