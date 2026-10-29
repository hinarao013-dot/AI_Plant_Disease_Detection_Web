import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const plantCatalogService = {
  getAll: () => api.get('/plant-catalog').then((res) => res.data),
  getById: (id) => api.get(`/plant-catalog/${id}`).then((res) => res.data),
  create: (data) => api.post('/plant-catalog', data).then((res) => res.data),
  update: (id, data) => api.put(`/plant-catalog/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/plant-catalog/${id}`).then((res) => res.data),
};

export const scanHistoryService = {
  getAll: () => api.get('/scan-history').then((res) => res.data),
  getById: (id) => api.get(`/scan-history/${id}`).then((res) => res.data),
  create: (data) => api.post('/scan-history', data).then((res) => res.data),
  delete: (id) => api.delete(`/scan-history/${id}`).then((res) => res.data),
};

// Compatibility aliases
export const participantService = plantCatalogService;
export const bookingService = scanHistoryService;

export default api;
