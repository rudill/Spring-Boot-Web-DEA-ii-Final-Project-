import axios from 'axios';

// Use relative path for API calls - works for both local dev and production
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const roomService = {
  // CRUD
  getAllRooms: () => api.get('/rooms'),
  getRoomByNumber: (roomNumber) => api.get(`/rooms/${roomNumber}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  deleteRoom: (roomNumber) => api.delete(`/rooms/${roomNumber}`),
  updateRoomStatus: (roomNumber, status, changedBy = 'ADMIN') =>
    api.patch(`/rooms/${roomNumber}/status`, { status, changedBy }),

  // Availability
  getAvailableRooms: () => api.get('/rooms/available'),
  getAvailableRoomsByDate: (date) => api.get('/rooms/available/by-date', { params: { date } }),
  getOccupiedRooms: () => api.get('/rooms/occupied'),
  getOccupiedRoomsByDate: (date) => api.get('/rooms/occupied/by-date', { params: { date } }),
  getMaintenanceRooms: () => api.get('/rooms/maintenance'),
  getMaintenanceRoomsByDate: (date) => api.get('/rooms/maintenance/by-date', { params: { date } }),

  // Room Counts - GET /rooms/count returns { singleRooms, doubleRooms, deluxeRooms, totalRooms }
  getRoomCounts: () => api.get('/rooms/count'),

  // Check-in / Check-out
  checkInRoom: (roomNumber, changedBy = 'SYSTEM') =>
    api.post(`/rooms/${roomNumber}/check-in`, null, { params: { changedBy } }),
  checkOutRoom: (roomNumber, changedBy = 'SYSTEM') =>
    api.post(`/rooms/${roomNumber}/check-out`, null, { params: { changedBy } }),

  // Maintenance
  markRoomForMaintenance: (roomNumber, changedBy = 'MAINTENANCE') =>
    api.post(`/rooms/${roomNumber}/maintenance`, null, { params: { changedBy } }),
  markRoomAvailableAfterMaintenance: (roomNumber, changedBy = 'MAINTENANCE') =>
    api.post(`/rooms/${roomNumber}/available-after-maintenance`, null, { params: { changedBy } }),

  // Status History
  getStatusHistory: (roomNumber) => api.get(`/rooms/${roomNumber}/status-history`),
  getStatusHistoryByDate: (roomNumber, date) =>
    api.get(`/rooms/${roomNumber}/status-history/by-date`, { params: { date } }),
  getStatusHistoryByDateRange: (roomNumber, startDate, endDate) =>
    api.get(`/rooms/${roomNumber}/status-history/by-date-range`, { params: { startDate, endDate } }),
  getLatestRoomStatus: (roomNumber) => api.get(`/rooms/${roomNumber}/latest-status`),
  getAllRoomsStatusHistoryByDate: (date) => api.get('/rooms/history/by-date', { params: { date } }),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  validateToken: (token) => api.post('/auth/validate', { token }),
};

export default api;
