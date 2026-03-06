import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const menuService = {
  getAllMenuItems: () => api.get('/menu/all'),
  getMenuItemById: (id) => api.get(`/menu/${id}`),
  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (id, data) => api.put(`/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
  toggleAvailability: (id) => api.patch(`/menu/${id}/availability`),
  getByCategory: (category) => api.get(`/menu/category/${category}`),
  searchByName: (name) => api.get(`/menu/search?name=${name}`),
};

export const tableService = {
  getAllTables: () => api.get('/tables'),
  getTableById: (id) => api.get(`/tables/${id}`),
  createTable: (data) => api.post('/tables', data),
  updateTable: (id, data) => api.put(`/tables/${id}`, data),
  deleteTable: (id) => api.delete(`/tables/${id}`),
  getAvailableTables: () => api.get('/tables/available'),
  getByStatus: (status) => api.get(`/tables/status/${status}`),
  occupyTable: (id) => api.put(`/tables/${id}/occupy`),
  freeTable: (id) => api.put(`/tables/${id}/free`),
};

export const orderService = {
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getActiveOrders: () => api.get('/orders/active'),
  getByStatus: (status) => api.get(`/orders/status/${status}`),
  getByTable: (tableId) => api.get(`/orders/table/${tableId}`),
  getDashboardCounts: () => api.get('/orders/dashboard/counts'),
};

export default api;
