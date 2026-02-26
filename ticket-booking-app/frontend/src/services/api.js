import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token === "admin-static-token") {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return config;
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== AUTH =====
export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);

// ===== EVENTS =====
export const getEvents = () => api.get("/events");
export const createEvent = (data) => api.post("/events", data);

// ===== SHOWS =====
export const getShowsForEvent = (eventId) => api.get(`/shows/event/${eventId}`);
export const createShow = (data) => api.post("/shows/", data);

// ===== REPORTS =====
export const getEventWiseBookings = () => {
  return api.get("/reports/event-wise-bookings");
};

export const getTotalBookings = () => {
  return api.get("/reports/total-bookings");
};

export const getMyBookings = () => {
  return api.get("/reports/my-bookings");
};

// ===== BOOKING =====
export const bookTicket = (data) => api.post("/book", data);
export const getBookedSeats = (showId) => api.get(`/booked-seats/${showId}`);

export default api;
