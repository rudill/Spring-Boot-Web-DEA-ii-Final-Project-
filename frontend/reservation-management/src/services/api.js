import axios from 'axios';

const reservationApi = axios.create({
  baseURL: 'http://52.221.207.161:8081/api',
});

const roomApi = axios.create({
  baseURL: 'http://localhost:8082/api',
});

// Reservation Service Endpoints
export const saveGuest = (guestData) => reservationApi.post('/v1/guest/saveguest', guestData);
export const saveReservation = (reservationData) => reservationApi.post('/reservations', reservationData);
export const getAllReservations = () => reservationApi.get('/reservations');
export const getReservationsByGuest = (guestId) => reservationApi.get(`/reservations/guest/${guestId}`);
export const updateReservationStatus = (id, status) => reservationApi.patch(`/reservations/${id}/status?status=${status}`);
export const deleteReservation = (id) => reservationApi.delete(`/reservations/${id}`);
export const getAllGuests = () => reservationApi.get('/v1/guest/getguests');
export const getGuestById = (id) => reservationApi.get(`/v1/guest/${id}`);
export const findGuestByNic = (nic) => reservationApi.get(`/v1/guest/findGuestByNic/${nic}`);
export const updateGuest = (guestData) => reservationApi.put('/v1/guest/updateguest', guestData);
export const deleteGuest = (guestData) => reservationApi.delete('/v1/guest/deleteguest', { data: guestData });

// Room Service Endpoints
export const getAllRooms = () => roomApi.get('/rooms');
export const getAvailableRooms = () => reservationApi.get('/reservations/available-rooms');

export default { reservationApi, roomApi };
