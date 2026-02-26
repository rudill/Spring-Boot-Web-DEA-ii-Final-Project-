import axios from "axios";

const API = "http://localhost:8087/api/events";

export const getVenues = () => axios.get(`${API}/venues`);
export const addVenue = (data) => axios.post(`${API}/venues`, data);
export const getVenueById = (id) => axios.get(`${API}/venues/${id}`);
export const updateVenue = (id, data) => axios.put(`${API}/venues/${id}`, data);
export const deleteVenue = (id) => axios.delete(`${API}/venues/${id}`);

export const bookEvent = (data) => axios.post(`${API}/book`, data);
export const getEvents = () => axios.get(API);
export const getEventById = (id) => axios.get(`${API}/${id}`);
export const updateEvent = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteEvent = (id) => axios.delete(`${API}/${id}`);
