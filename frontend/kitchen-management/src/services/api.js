import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api/kitchen';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const menuService = {
  getAllMenuItems: () => api.get('/menu'),
  getMenuItemById: (id) => api.get(`/menu/${id}`),
  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (id, data) => api.put(`/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
  toggleAvailability: (id) => api.patch(`/menu/${id}/toggle-availability`),
  getByRestaurant: (restaurantId) => api.get(`/menu/restaurant/${restaurantId}`),
  getByMealType: (mealType) => api.get(`/menu/meal-type/${mealType}`),
  getByServiceType: (serviceType) => api.get(`/menu/service-type/${serviceType}`),
  getByMenuDate: (date) => api.get(`/menu/date/${date}`),
  searchByName: (name) => api.get(`/menu/search?name=${name}`),
  getByCategory: (category) => api.get(`/menu/category/${category}`),
  getAvailable: () => api.get('/menu/available'),
  getEventMenu: () => api.get('/menu/event-menu'),
  getRestaurantMenu: () => api.get('/menu/restaurant-menu'),
};

export const orderService = {
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  getByStatus: (status) => api.get(`/orders/status/${status}`),
  getByStaff: (staffId) => api.get(`/orders/staff/${staffId}`),
  getByRestaurant: (restaurantId) => api.get(`/orders/restaurant/${restaurantId}`),
  getDashboardCounts: () => api.get('/orders/dashboard/counts'),
};

export default api;
