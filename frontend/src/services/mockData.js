// ─── MOCK DATABASE ──────────────────────────────────────────────
// Replace these calls with real axios/fetch calls to your backend

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

let MOCK_RESERVATIONS = [
  {
    id: 1,
    tableId: 3,
    tableNumber: "T3",
    tableLocation: "Center",
    date: "2026-05-10",
    time: "19:00",
    guests: 3,
    status: "confirmed",
    specialRequest: "Window seat preferred",
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    id: 2,
    tableId: 6,
    tableNumber: "T6",
    tableLocation: "Private",
    date: "2026-05-15",
    time: "20:00",
    guests: 5,
    status: "confirmed",
    specialRequest: "",
    createdAt: "2026-05-02T12:00:00Z",
  },
  {
    id: 101,
    tableId: 1,
    tableNumber: "T1",
    tableLocation: "Window",
    date: "2026-03-14",
    time: "18:00",
    guests: 2,
    status: "completed",
    specialRequest: "",
    createdAt: "2026-03-10T09:00:00Z",
  },
  {
    id: 102,
    tableId: 5,
    tableNumber: "T5",
    tableLocation: "Terrace",
    date: "2026-04-20",
    time: "13:00",
    guests: 4,
    status: "completed",
    specialRequest: "Birthday celebration",
    createdAt: "2026-04-15T14:00:00Z",
  },
];

let nextId = 200;

// ─── AUTH ────────────────────────────────────────────────────────
const USERS_KEY = "dinebook_users";
const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

export const apiRegister = async ({ name, email, password }) => {
  await delay(600);
  const users = getUsers();
  if (users.find((u) => u.email === email)) throw new Error("Email already registered.");
  const user = { id: Date.now(), name, email, password, phone: "", createdAt: new Date().toISOString() };
  saveUsers([...users, user]);
  const { password: _, ...safe } = user;
  return { user: safe, token: btoa(JSON.stringify(safe)) };
};

export const apiLogin = async ({ email, password }) => {
  await delay(600);
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password.");
  const { password: _, ...safe } = user;
  return { user: safe, token: btoa(JSON.stringify(safe)) };
};

export const apiUpdateProfile = async ({ userId, name, email, phone }) => {
  await delay(500);
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found.");
  users[idx] = { ...users[idx], name, email, phone };
  saveUsers(users);
  const { password: _, ...safe } = users[idx];
  return { user: safe };
};

// ─── TABLES ──────────────────────────────────────────────────────
export const apiGetAvailableTables = async ({ date, time, guests }) => {
  await delay(700);
  // Simulate taken tables for the date+time combo
  const taken = MOCK_RESERVATIONS
    .filter((r) => r.date === date && r.time === time && r.status !== "cancelled")
    .map((r) => r.tableId);
  return MOCK_TABLES.filter(
    (t) => !taken.includes(t.id) && t.capacity >= Number(guests)
  );
};

// ─── RESERVATIONS ────────────────────────────────────────────────
export const apiGetReservations = async (userId) => {
  await delay(500);
  return MOCK_RESERVATIONS;
};

export const apiCreateReservation = async ({ tableId, date, time, guests, specialRequest }) => {
  await delay(700);
  const table = MOCK_TABLES.find((t) => t.id === tableId);
  const res = {
    id: nextId++,
    tableId,
    tableNumber: table.number,
    tableLocation: table.location,
    date,
    time,
    guests: Number(guests),
    status: "confirmed",
    specialRequest: specialRequest || "",
    createdAt: new Date().toISOString(),
  };
  MOCK_RESERVATIONS = [...MOCK_RESERVATIONS, res];
  return res;
};

export const apiCancelReservation = async (reservationId) => {
  await delay(600);
  const res = MOCK_RESERVATIONS.find((r) => r.id === reservationId);
  if (!res) throw new Error("Reservation not found.");
  const dt = new Date(`${res.date}T${res.time}`);
  const diffHours = (dt - new Date()) / 36e5;
  if (diffHours < 2) throw new Error("Cannot cancel within 2 hours of reservation.");
  MOCK_RESERVATIONS = MOCK_RESERVATIONS.map((r) =>
    r.id === reservationId ? { ...r, status: "cancelled" } : r
  );
  return { success: true };
};

export const apiUpdateReservation = async (reservationId, { date, time, guests, specialRequest }) => {
  await delay(700);
  MOCK_RESERVATIONS = MOCK_RESERVATIONS.map((r) =>
    r.id === reservationId ? { ...r, date, time, guests: Number(guests), specialRequest } : r
  );
  return MOCK_RESERVATIONS.find((r) => r.id === reservationId);
};

export const apiGetWorkingHours = async () => {
  await delay(300);
  return WORKING_HOURS;
};

// ─── HELPERS ─────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
