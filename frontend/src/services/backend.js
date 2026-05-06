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

