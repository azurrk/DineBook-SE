import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetAvailableTables, apiCreateReservation } from "../services/backend";
import { Search, Users, MapPin, Check, ChevronRight, CalendarDays, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { format, addDays } from "date-fns";
import "./MakeReservation.css";

const TIME_SLOTS = [
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"
];

const STEPS = ["Search", "Choose Table", "Confirm"];

export default function MakeReservation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 0
  const today = format(new Date(), "yyyy-MM-dd");
  const [search, setSearch] = useState({ date: today, time: "19:00", guests: "2" });
  const [searchErr, setSearchErr] = useState({});
  const [searching, setSearching] = useState(false);

  // Step 1
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  // Step 2
  const [specialRequest, setSpecialRequest] = useState("");
  const [booking, setBooking] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!search.date) errs.date = "Select a date.";
    if (!search.time) errs.time = "Select a time.";
    if (!search.guests || search.guests < 1) errs.guests = "At least 1 guest.";
    if (Object.keys(errs).length) { setSearchErr(errs); return; }
    setSearching(true);
    try {
      const result = await apiGetAvailableTables(search);
      setTables(result);
      setSelectedTable(null);
      setStep(1);
    } catch {
      toast.error("Could not fetch available tables.");
    } finally {
      setSearching(false);
    }
  };

  const handleConfirm = async () => {
    setBooking(true);
    try {
      await apiCreateReservation({
        tableId: selectedTable.id,
        date: search.date,
        time: search.time,
        guests: search.guests,
        specialRequest,
      });
      toast.success("Reservation confirmed! Check your email. 🎉");
      navigate("/reservations");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBooking(false);
    }
  };

  const set = (k) => (e) => { setSearch((s) => ({ ...s, [k]: e.target.value })); setSearchErr((er) => ({ ...er, [k]: "" })); };

  return (
    <div className="page reserve-page">
      <div className="reserve-header">
        <h2>Reserve a Table</h2>
        <p>Find and book the perfect spot for your visit</p>
      </div>

      {/* Stepper */}
      <div className="stepper">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`step ${i === step ? "active" : i < step ? "done" : ""}`}>
              <div className="step-circle">
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Step 0: Search ── */}
      {step === 0 && (
        <div className="card reserve-card animate-fade-up">
          <h3>When are you dining?</h3>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label><CalendarDays size={14} /> Date</label>
              <input type="date" value={search.date} min={today} max={format(addDays(new Date(), 60), "yyyy-MM-dd")} onChange={set("date")} />
              {searchErr.date && <span className="form-error">{searchErr.date}</span>}
            </div>
            <div className="form-group">
              <label><Clock size={14} /> Time</label>
              <select value={search.time} onChange={set("time")}>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {searchErr.time && <span className="form-error">{searchErr.time}</span>}
            </div>
            <div className="form-group">
              <label><Users size={14} /> Guests</label>
              <input type="number" min="1" max="20" value={search.guests} onChange={set("guests")} />
              {searchErr.guests && <span className="form-error">{searchErr.guests}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={searching}>
              {searching ? <><span className="spinner" /> Searching...</> : <><Search size={16} /> Find Tables</>}
            </button>
          </form>
        </div>
      )}

      {/* ── Step 1: Choose Table ── */}
      {step === 1 && (
        <div className="animate-fade-up">
          <div className="step-action-bar">
            <button className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>← Back</button>
            <p className="results-summary">
              <strong>{tables.length}</strong> table{tables.length !== 1 ? "s" : ""} available
              for {search.guests} guest{search.guests > 1 ? "s" : ""} on <strong>{search.date}</strong> at <strong>{search.time}</strong>
            </p>
          </div>

          {tables.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No tables available</h3>
              <p>Try a different date, time, or reduce guest count.</p>
              <button className="btn btn-outline" onClick={() => setStep(0)}>Search Again</button>
            </div>
          ) : (
            <div className="tables-grid">
              {tables.map((t) => (
                <div
                  key={t.id}
                  className={`table-card ${selectedTable?.id === t.id ? "selected" : ""}`}
                  onClick={() => setSelectedTable(t)}
                >
                  {selectedTable?.id === t.id && (
                    <div className="table-check"><Check size={14} /></div>
                  )}
                  <div className="table-number">{t.number}</div>
                  <div className="table-info">
                    <span><Users size={14} /> Up to {t.capacity} guests</span>
                    <span><MapPin size={14} /> {t.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTable && (
            <div className="sticky-confirm">
              <span>Table <strong>{selectedTable.number}</strong> selected</span>
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Confirm ── */}
      {step === 2 && selectedTable && (
        <div className="card reserve-card animate-fade-up">
          <button className="btn btn-ghost btn-sm back-btn" onClick={() => setStep(1)}>← Back</button>
          <h3>Confirm your reservation</h3>

          <div className="confirm-summary">
            <div className="confirm-row"><span>Date</span><strong>{search.date}</strong></div>
            <div className="confirm-row"><span>Time</span><strong>{search.time}</strong></div>
            <div className="confirm-row"><span>Guests</span><strong>{search.guests}</strong></div>
            <div className="confirm-row"><span>Table</span><strong>{selectedTable.number} — {selectedTable.location}</strong></div>
            <div className="confirm-row"><span>Capacity</span><strong>Up to {selectedTable.capacity}</strong></div>
          </div>

          <div className="form-group" style={{ marginTop: 24 }}>
            <label>Special Request <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
            <textarea
              placeholder="e.g. Window seat, birthday celebration, dietary restrictions..."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
            />
          </div>

          <p className="confirm-note">
            📧 A confirmation email will be sent after booking. You may cancel up to 2 hours before your reservation.
          </p>

          <button className="btn btn-primary btn-full btn-lg" onClick={handleConfirm} disabled={booking} style={{ marginTop: 8 }}>
            {booking ? <><span className="spinner" /> Confirming...</> : <><Check size={16} /> Confirm Reservation</>}
          </button>
        </div>
      )}
    </div>
  );
}
