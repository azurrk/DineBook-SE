// ─── MOCK DATABASE ──────────────────────────────────────────────
// Legacy mock data for reference - now using real API

export const MOCK_TABLES = [
  { id: 1, number: "T1", capacity: 2, location: "Window", status: "available" },
  { id: 2, number: "T2", capacity: 2, location: "Window", status: "available" },
  { id: 3, number: "T3", capacity: 4, location: "Center", status: "available" },
  { id: 4, number: "T4", capacity: 4, location: "Center", status: "available" },
  { id: 5, number: "T5", capacity: 4, location: "Terrace", status: "available" },
  { id: 6, number: "T6", capacity: 6, location: "Private", status: "available" },
  { id: 7, number: "T7", capacity: 6, location: "Terrace", status: "available" },
  { id: 8, number: "T8", capacity: 8, location: "Private", status: "available" },
];

export const WORKING_HOURS = {
  Monday:    { open: "11:00", close: "22:00", closed: false },
  Tuesday:   { open: "11:00", close: "22:00", closed: false },
  Wednesday: { open: "11:00", close: "22:00", closed: false },
  Thursday:  { open: "11:00", close: "23:00", closed: false },
  Friday:    { open: "11:00", close: "23:00", closed: false },
  Saturday:  { open: "10:00", close: "23:00", closed: false },
  Sunday:    { open: "10:00", close: "21:00", closed: false },
};

import api from './api';

// ─── AUTH ────────────────────────────────────────────────────────
export const apiRegister = async ({ name, email, password }) => {
  try {
    const response = await api.post('/register', { name, email, password });
    api.setToken(response.token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiLogin = async ({ email, password }) => {
  try {
    const response = await api.post('/login', { email, password });
    api.setToken(response.token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiUpdateProfile = async ({ userId, name, email, phone }) => {
  try {
    const response = await api.put('/profile', { name, email, phone });
    return response;
  } catch (error) {
    throw error;
  }
};

// ─── TABLES ──────────────────────────────────────────────────────
export const apiGetAvailableTables = async ({ date, time, guests }) => {
  try {
    const response = await api.get(`/tables/available?date=${date}&time=${time}&guests=${guests}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// ─── RESERVATIONS ────────────────────────────────────────────────
export const apiGetReservations = async (userId) => {
  try {
    const response = await api.get('/reservations');
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiCreateReservation = async ({ tableId, date, time, guests, specialRequest }) => {
  try {
    const response = await api.post('/reservations', { tableId, date, time, guests, specialRequest });
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiCancelReservation = async (reservationId) => {
  try {
    const response = await api.put(`/reservations/${reservationId}/cancel`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiUpdateReservation = async (reservationId, { date, time, guests, specialRequest }) => {
  try {
    const response = await api.put(`/reservations/${reservationId}`, { date, time, guests, specialRequest });
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiGetWorkingHours = async () => {
  try {
    const response = await api.get('/working-hours');
    return response;
  } catch (error) {
    throw error;
  }
};

