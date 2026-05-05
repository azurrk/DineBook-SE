import React, { useState, useEffect } from "react";
import { apiGetWorkingHours } from "../services/backend";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import "./Hours.css";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function Hours() {
  const [hours, setHours] = useState(null);
  const today = new Date().toLocaleString("en-US", { weekday: "long" });

  useEffect(() => {
    apiGetWorkingHours().then(setHours);
  }, []);

  return (
    <div className="page hours-page">
      <div className="hours-header">
        <h2>Working Hours</h2>
        <p>Plan your visit — we're open almost every day!</p>
      </div>

      <div className="card hours-card">
        <div className="hours-list">
          {hours && DAYS.map((day) => {
            const h = hours[day];
            const isToday = day === today;
            return (
              <div key={day} className={`hours-row ${isToday ? "today" : ""}`}>
                <div className="hours-day">
                  {isToday && <span className="today-dot" />}
                  <span>{day}</span>
                  {isToday && <span className="today-label">Today</span>}
                </div>
                <div className="hours-time">
                  {h.closed ? (
                    <span className="hours-closed"><XCircle size={15} /> Closed</span>
                  ) : (
                    <span className="hours-open"><CheckCircle2 size={15} /> {h.open} – {h.close}</span>
                  )}
                </div>
              </div>
            );
          })}
          {!hours && (
            <div className="hours-loading">
              <div className="spinner spinner-dark" />
              Loading hours...
            </div>
          )}
        </div>
      </div>

      <div className="card hours-note">
        <Clock size={20} />
        <p>Last orders are taken 30 minutes before closing. For special events or group bookings, please contact us in advance.</p>
      </div>
    </div>
  );
}
