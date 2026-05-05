import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, Star, Shield, Clock, ChevronRight, UtensilsCrossed } from "lucide-react";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <UtensilsCrossed size={14} />
            Restaurant Reservations
          </div>
          <h1>Reserve Your Perfect<br /><em>Table Tonight</em></h1>
          <p className="hero-sub">
            Browse available tables, choose your moment, and book instantly.
            No phone calls, no waiting — just effortless dining.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/reserve" className="btn btn-primary btn-lg">
                Book a Table <ChevronRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free <ChevronRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features page">
        <div className="section-header">
          <h2>Everything you need to dine seamlessly</h2>
          <p>From browsing to booking, we handle every step.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="cta-section">
          <div className="cta-inner">
            <h2>Ready for a great dining experience?</h2>
            <p>Join DineBook and start making reservations in minutes.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account <ChevronRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

const FEATURES = [
  {
    icon: <CalendarDays size={28} />,
    title: "Instant Booking",
    desc: "See real-time availability and reserve your table in under a minute.",
  },
  {
    icon: <Star size={28} />,
    title: "Leave Reviews",
    desc: "Share your experience and help others discover the best dining spots.",
  },
  {
    icon: <Shield size={28} />,
    title: "Easy Management",
    desc: "Modify or cancel your reservations up to 2 hours before your visit.",
  },
  {
    icon: <Clock size={28} />,
    title: "Email Confirmations",
    desc: "Receive instant confirmation emails with all your booking details.",
  },
];
