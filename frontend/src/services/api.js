import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventService = {
  getAll: () => api.get('/events').then((res) => res.data),
  getById: (id) => api.get(`/events/${id}`).then((res) => res.data),
  create: (data) => api.post('/events', data).then((res) => res.data),
  update: (id, data) => api.put(`/events/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/events/${id}`).then((res) => res.data),
};

export const participantService = {
  getAll: () => api.get('/participants').then((res) => res.data),
  getById: (id) => api.get(`/participants/${id}`).then((res) => res.data),
  create: (data) => api.post('/participants', data).then((res) => res.data),
  update: (id, data) => api.put(`/participants/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/participants/${id}`).then((res) => res.data),
};

export const venueService = {
  getAll: () => api.get('/venues').then((res) => res.data),
  getById: (id) => api.get(`/venues/${id}`).then((res) => res.data),
  create: (data) => api.post('/venues', data).then((res) => res.data),
  update: (id, data) => api.put(`/venues/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/venues/${id}`).then((res) => res.data),
};

export const bookingService = {
  getAll: () => api.get('/bookings').then((res) => res.data),
  getById: (id) => api.get(`/bookings/${id}`).then((res) => res.data),
  create: (data) => api.post('/bookings', data).then((res) => res.data),
  update: (id, data) => api.put(`/bookings/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/bookings/${id}`).then((res) => res.data),
};

export const categoryService = {
  getAll: () => api.get('/categories').then((res) => res.data),
  getById: (id) => api.get(`/categories/${id}`).then((res) => res.data),
  create: (data) => api.post('/categories', data).then((res) => res.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/categories/${id}`).then((res) => res.data),
};

export default api;
