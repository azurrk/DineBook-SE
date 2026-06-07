import api from './api';

const normalizeReservation = (reservation) => ({
  ...reservation,
  tableNumber: reservation.tableNumber || reservation.table_number,
  tableLocation: reservation.tableLocation || reservation.table_location,
  tableCapacity: reservation.tableCapacity || reservation.table_capacity,
  specialRequest: reservation.specialRequest || reservation.special_request,
  userName: reservation.userName || reservation.user_name,
  userEmail: reservation.userEmail || reservation.user_email,
  reviewId: reservation.reviewId || reservation.review_id,
  reviewRating: reservation.reviewRating || reservation.review_rating,
  reviewComment: reservation.reviewComment || reservation.review_comment,
});

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

export const apiGetFloorPlan = async ({ date, time, guests }) => (
  api.get(`/tables/floor-plan?date=${date}&time=${time}&guests=${guests}`)
);

// ─── RESERVATIONS ────────────────────────────────────────────────
export const apiGetReservations = async (userId) => {
  try {
    const response = await api.get('/reservations');
    return response.map(normalizeReservation);
  } catch (error) {
    throw error;
  }
};

export const apiCreateReservation = async ({ tableId, date, time, guests, specialRequest }) => {
  try {
    const response = await api.post('/reservations', { tableId, date, time, guests, specialRequest });
    return normalizeReservation(response);
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
    return normalizeReservation(response);
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

export const apiGetReviews = async () => api.get('/reviews');

export const apiCreateReview = async ({ reservationId, rating, comment }) => (
  api.post('/reviews', { reservationId, rating, comment })
);

export const apiGetAdminDashboard = async (date) => api.get(`/admin/dashboard?date=${date}`);

export const apiGetAdminReservations = async (search = '') => {
  const response = await api.get(`/admin/reservations?search=${encodeURIComponent(search)}`);
  return response.map(normalizeReservation);
};

export const apiUpdateReservationStatus = async (reservationId, status) => (
  api.put(`/admin/reservations/${reservationId}/status`, { status })
);

export const apiGetAdminUsers = async () => api.get('/admin/users');

export const apiSetUserActive = async (userId, active) => (
  api.put(`/admin/users/${userId}/active`, { active })
);

export const apiGetTables = async () => api.get('/tables');

export const apiCreateTable = async (table) => api.post('/tables', table);

export const apiUpdateTable = async (id, table) => api.put(`/tables/${id}`, table);

export const apiDeleteTable = async (id) => api.delete(`/tables/${id}`);

export const apiUpdateWorkingHours = async (hours) => api.put('/working-hours', hours);
