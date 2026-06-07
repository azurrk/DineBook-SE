import React, { useEffect, useState } from "react";
import {
  apiCreateTable,
  apiDeleteTable,
  apiGetAdminDashboard,
  apiGetAdminReservations,
  apiGetAdminUsers,
  apiGetTables,
  apiGetWorkingHours,
  apiSetUserActive,
  apiUpdateReservationStatus,
  apiUpdateTable,
  apiUpdateWorkingHours,
} from "../services/backend";
import { CalendarDays, Check, Clock, Search, Table2, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import "./Admin.css";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const EMPTY_TABLE = { number: "", capacity: 2, location: "Center", status: "available", x: 20, y: 20 };

export default function Admin() {
  const today = new Date().toISOString().slice(0, 10);
  const [tab, setTab] = useState("dashboard");
  const [date, setDate] = useState(today);
  const [dashboard, setDashboard] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [tables, setTables] = useState([]);
  const [tableForm, setTableForm] = useState(EMPTY_TABLE);
  const [hours, setHours] = useState(null);
  const [users, setUsers] = useState([]);

  const loadAdminData = async () => {
    const [dash, reservationRows, tableRows, hoursRows, userRows] = await Promise.all([
      apiGetAdminDashboard(date),
      apiGetAdminReservations(search),
      apiGetTables(),
      apiGetWorkingHours(),
      apiGetAdminUsers(),
    ]);
    setDashboard(dash);
    setReservations(reservationRows);
    setTables(tableRows);
    setHours(hoursRows);
    setUsers(userRows);
  };

  useEffect(() => {
    loadAdminData().catch((err) => toast.error(err.message));
  }, [date]);

  const updateStatus = async (id, status) => {
    try {
      await apiUpdateReservationStatus(id, status);
      await loadAdminData();
      toast.success(`Reservation ${status}.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const saveTable = async (e) => {
    e.preventDefault();
    try {
      if (tableForm.id) await apiUpdateTable(tableForm.id, tableForm);
      else await apiCreateTable(tableForm);
      setTableForm(EMPTY_TABLE);
      setTables(await apiGetTables());
      toast.success("Table saved.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removeTable = async (id) => {
    if (!window.confirm("Delete this table?")) return;
    try {
      await apiDeleteTable(id);
      setTables(await apiGetTables());
      toast.success("Table deleted.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const saveHours = async () => {
    try {
      setHours(await apiUpdateWorkingHours(hours));
      toast.success("Working hours updated.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleUser = async (user) => {
    try {
      await apiSetUserActive(user.id, !user.active);
      setUsers(await apiGetAdminUsers());
    } catch (err) {
      toast.error(err.message);
    }
  };

  const grouped = dashboard?.groupedByTime || {};

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <div>
          <h2>Admin Panel</h2>
          <p>Manage bookings, tables, hours, and customer access.</p>
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="admin-tabs">
        {[
          ["dashboard", CalendarDays, "Dashboard"],
          ["reservations", Search, "Reservations"],
          ["tables", Table2, "Tables"],
          ["hours", Clock, "Hours"],
          ["users", Users, "Users"],
        ].map(([key, Icon, label]) => (
          <button key={key} className={`admin-tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <section className="admin-grid">
          <div className="admin-stat"><span>Pending</span><strong>{dashboard?.totals?.pending || 0}</strong></div>
          <div className="admin-stat"><span>Confirmed</span><strong>{dashboard?.totals?.confirmed || 0}</strong></div>
          <div className="admin-list wide">
            {Object.keys(grouped).length === 0 && <p className="muted">No reservations for this date.</p>}
            {Object.entries(grouped).map(([time, rows]) => (
              <div className="time-group" key={time}>
                <h3>{time}</h3>
                {rows.map((r) => <ReservationRow key={r.id} reservation={r} onStatus={updateStatus} />)}
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "reservations" && (
        <section className="admin-list">
          <form className="admin-search" onSubmit={(e) => { e.preventDefault(); loadAdminData(); }}>
            <input placeholder="Search by customer name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-primary" type="submit"><Search size={15} /> Search</button>
          </form>
          {reservations.map((r) => <ReservationRow key={r.id} reservation={r} onStatus={updateStatus} />)}
        </section>
      )}

      {tab === "tables" && (
        <section className="admin-split">
          <form className="card admin-form" onSubmit={saveTable}>
            <h3>{tableForm.id ? "Edit Table" : "Add Table"}</h3>
            <input placeholder="Number" value={tableForm.number} onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })} />
            <input type="number" min="1" placeholder="Capacity" value={tableForm.capacity} onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })} />
            <input placeholder="Location" value={tableForm.location} onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })} />
            <select value={tableForm.status} onChange={(e) => setTableForm({ ...tableForm, status: e.target.value })}>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <div className="form-row">
              <input type="number" min="0" max="100" value={tableForm.x} onChange={(e) => setTableForm({ ...tableForm, x: e.target.value })} />
              <input type="number" min="0" max="100" value={tableForm.y} onChange={(e) => setTableForm({ ...tableForm, y: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit"><Check size={15} /> Save Table</button>
          </form>
          <div className="admin-list">
            {tables.map((table) => (
              <div className="admin-row" key={table.id}>
                <strong>{table.number}</strong>
                <span>{table.capacity} seats, {table.location}, {table.status}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setTableForm(table)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => removeTable(table.id)}><X size={13} /> Delete</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "hours" && hours && (
        <section className="card admin-hours">
          {DAYS.map((day) => (
            <div className="hours-edit-row" key={day}>
              <strong>{day}</strong>
              <input type="time" value={hours[day]?.open?.slice(0, 5) || "11:00"} onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], open: e.target.value } })} />
              <input type="time" value={hours[day]?.close?.slice(0, 5) || "22:00"} onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], close: e.target.value } })} />
              <label className="checkbox-label"><input type="checkbox" checked={Boolean(hours[day]?.closed)} onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], closed: e.target.checked } })} /> Closed</label>
            </div>
          ))}
          <button className="btn btn-primary" onClick={saveHours}><Check size={15} /> Save Hours</button>
        </section>
      )}

      {tab === "users" && (
        <section className="admin-list">
          {users.map((user) => (
            <div className="admin-row" key={user.id}>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <button className={`btn btn-sm ${user.active ? "btn-danger" : "btn-outline"}`} onClick={() => toggleUser(user)}>
                {user.active ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function ReservationRow({ reservation, onStatus }) {
  return (
    <div className="admin-row">
      <strong>{reservation.userName || reservation.user_name}</strong>
      <span>{reservation.date} {reservation.time} · Table {reservation.tableNumber || reservation.table_number} · {reservation.guests} guests</span>
      <span className={`badge badge-${reservation.status}`}>{reservation.status}</span>
      {reservation.status === "pending" && (
        <>
          <button className="btn btn-outline btn-sm" onClick={() => onStatus(reservation.id, "confirmed")}><Check size={13} /> Confirm</button>
          <button className="btn btn-danger btn-sm" onClick={() => onStatus(reservation.id, "rejected")}><X size={13} /> Reject</button>
        </>
      )}
      {reservation.status === "confirmed" && (
        <button className="btn btn-ghost btn-sm" onClick={() => onStatus(reservation.id, "completed")}>Complete</button>
      )}
    </div>
  );
}
