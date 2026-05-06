import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiGetReservations, apiCancelReservation, apiUpdateReservation } from "../services/backend";
import { CalendarDays, Clock, Users, MapPin, Pencil, X, Check, History, Plus } from "lucide-react";
import toast from "react-hot-toast";
import EditReservationModal from "../components/reservation/EditReservationModal";
import "./Reservations.css";

const TIME_SLOTS = [
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"
];

export default function Reservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");
  const [editTarget, setEditTarget] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    apiGetReservations(user.id)
      .then(setReservations)
      .finally(() => setLoading(false));
  }, [user.id]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = reservations
    .filter((r) => r.status !== "cancelled" && r.status !== "completed" && new Date(r.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const history = reservations
    .filter((r) => r.status === "completed" || r.status === "cancelled" || new Date(r.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    setCancellingId(id);
    try {
      await apiCancelReservation(id);
      setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status: "cancelled" } : r));
      toast.success("Reservation cancelled.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const handleEdit = async (id, data) => {
    try {
      const updated = await apiUpdateReservation(id, data);
      setReservations((prev) => prev.map((r) => r.id === id ? updated : r));
      setEditTarget(null);
      toast.success("Reservation updated.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const shown = tab === "upcoming" ? upcoming : history;

  if (loading) return (
    <div className="page res-page loading-state">
      <div className="spinner spinner-dark" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  );

  return (
    <div className="page res-page">
      <div className="res-header">
        <div>
          <h2>My Reservations</h2>
          <p>Manage your bookings at a glance</p>
        </div>
        <Link to="/reserve" className="btn btn-primary">
          <Plus size={16} /> New Booking
        </Link>
      </div>

      {/* Tabs */}
      <div className="res-tabs">
        <button className={`res-tab ${tab === "upcoming" ? "active" : ""}`} onClick={() => setTab("upcoming")}>
          <CalendarDays size={15} /> Upcoming
          {upcoming.length > 0 && <span className="tab-badge">{upcoming.length}</span>}
        </button>
        <button className={`res-tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
          <History size={15} /> History
        </button>
      </div>

      {/* Cards */}
      {shown.length === 0 ? (
        <div className="card empty-res">
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>{tab === "upcoming" ? "📅" : "🕐"}</div>
          <h3>{tab === "upcoming" ? "No upcoming reservations" : "No past reservations"}</h3>
          {tab === "upcoming" && (
            <>
              <p>Ready to book your next dining experience?</p>
              <Link to="/reserve" className="btn btn-primary" style={{ marginTop: 20 }}>Book a Table</Link>
            </>
          )}
        </div>
      ) : (
        <div className="res-list">
          {shown.map((r, i) => (
            <div key={r.id} className="res-card animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="res-card-left">
                <div className="res-date-box">
                  <span className="res-month">{new Date(r.date).toLocaleString("en", { month: "short" })}</span>
                  <span className="res-day">{new Date(r.date).getDate()}</span>
                </div>
              </div>
              <div className="res-card-body">
                <div className="res-top">
                  <div>
                    <h3 className="res-title">Table {r.tableNumber}</h3>
                    <div className="res-meta">
                      <span><Clock size={13} /> {r.time}</span>
                      <span><Users size={13} /> {r.guests} guest{r.guests > 1 ? "s" : ""}</span>
                      <span><MapPin size={13} /> {r.tableLocation}</span>
                    </div>
                  </div>
                  <span className={`badge badge-${r.status}`}>{r.status}</span>
                </div>
                {r.specialRequest && (
                  <div className="res-special">
                    <span>📝</span> {r.specialRequest}
                  </div>
                )}
              </div>
              {r.status === "confirmed" && tab === "upcoming" && (
                <div className="res-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditTarget(r)}
                    title="Edit"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancel(r.id)}
                    disabled={cancellingId === r.id}
                    title="Cancel"
                  >
                    {cancellingId === r.id ? <span className="spinner" style={{ borderTopColor: "var(--red)" }} /> : <><X size={14} /> Cancel</>}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editTarget && (
        <EditReservationModal
          reservation={editTarget}
          timeSlots={TIME_SLOTS}
          onSave={(data) => handleEdit(editTarget.id, data)}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
