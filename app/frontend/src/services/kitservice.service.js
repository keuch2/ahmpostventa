import api from './api';

export const kitServiceService = {
  list: (params) => api.get('/admin/kits-service', { params }),
  show: (id) => api.get(`/admin/kits-service/${id}`),
  create: (data) => api.post('/admin/kits-service', data),
  update: (id, data) => api.put(`/admin/kits-service/${id}`, data),
  destroy: (id) => api.delete(`/admin/kits-service/${id}`),
  duplicar: (id) => api.post(`/admin/kits-service/${id}/duplicar`),
  // Items
  listItems: (kitId) => api.get(`/admin/kits-service/${kitId}/items`),
  createItem: (kitId, data) => api.post(`/admin/kits-service/${kitId}/items`, data),
  updateItem: (kitId, itemId, data) => api.put(`/admin/kits-service/${kitId}/items/${itemId}`, data),
  destroyItem: (kitId, itemId) => api.delete(`/admin/kits-service/${kitId}/items/${itemId}`),
};
