import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Menu Items
export const menuItemService = {
  getAll: () => api.get('/menu-items'),
  getById: (id) => api.get(`/menu-items/${id}`),
  getByCategory: (category) => api.get(`/menu-items/category/${category}`),
  getAvailable: () => api.get('/menu-items/available'),
  search: (name) => api.get('/menu-items/search', { params: { name } }),
  create: (data) => api.post('/menu-items', data),
  update: (id, data) => api.put(`/menu-items/${id}`, data),
  updateAvailability: (id, isAvailable) =>
    api.patch(`/menu-items/${id}/availability`, null, { params: { isAvailable } }),
  delete: (id) => api.delete(`/menu-items/${id}`),
};

// Restaurant Tables
export const tableService = {
  getAll: () => api.get('/tables'),
  getById: (id) => api.get(`/tables/${id}`),
  getByStatus: (status) => api.get(`/tables/status/${status}`),
  getAvailable: () => api.get('/tables/status/AVAILABLE'),
  create: (data) => api.post('/tables', data),
  update: (id, data) => api.put(`/tables/${id}`, data),
  updateStatus: (id, status) =>
    api.patch(`/tables/${id}/status`, null, { params: { status } }),
  delete: (id) => api.delete(`/tables/${id}`),
};

// Orders
export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getByStatus: (status) => api.get(`/orders/status/${status}`),
  getByTable: (tableId) => api.get(`/orders/table/${tableId}`),
  search: (customerName) => api.get('/orders/search', { params: { customerName } }),
  getStatistics: () => api.get('/orders/statistics'),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  updateStatus: (id, status) =>
    api.patch(`/orders/${id}/status`, null, { params: { status } }),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Order Items
export const orderItemService = {
  getByOrderId: (orderId) => api.get(`/order-items/order/${orderId}`),
  getById: (id) => api.get(`/order-items/${id}`),
  add: (data) => api.post('/order-items', data),
  updateQuantity: (id, quantity) =>
    api.patch(`/order-items/${id}/quantity`, null, { params: { quantity } }),
  delete: (id) => api.delete(`/order-items/${id}`),
};

export default api;
