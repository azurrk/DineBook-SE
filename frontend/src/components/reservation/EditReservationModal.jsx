import React, { useState } from "react";
import { X, Save } from "lucide-react";
import "./EditReservationModal.css";

export default function EditReservationModal({ reservation, timeSlots, onSave, onClose }) {
  const [form, setForm] = useState({
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    specialRequest: reservation.specialRequest || "",
  });
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-fade-up">
        <div className="modal-header">
          <h3>Edit Reservation</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} min={today} onChange={set("date")} />
          </div>
          <div className="form-group">
            <label>Time</label>
            <select value={form.time} onChange={set("time")}>
              {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Number of Guests</label>
            <input type="number" min="1" max="20" value={form.guests} onChange={set("guests")} />
          </div>
          <div className="form-group">
            <label>Special Request</label>
            <textarea
              placeholder="Any special requests..."
              value={form.specialRequest}
              onChange={set("specialRequest")}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner" /> Saving...</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
