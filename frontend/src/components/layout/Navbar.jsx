import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UtensilsCrossed, Menu, X, CalendarDays, User, LogOut, Clock } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <UtensilsCrossed size={22} />
          <span>DineBook</span>
        </Link>

        <div className={`navbar-links ${open ? "open" : ""}`}>
          <NavLink to="/hours" className="nav-link" onClick={() => setOpen(false)}>
            <Clock size={16} /> Hours
          </NavLink>

          {user ? (
            <>
              <NavLink to="/reservations" className="nav-link" onClick={() => setOpen(false)}>
                <CalendarDays size={16} /> My Reservations
              </NavLink>
              <NavLink to="/profile" className="nav-link" onClick={() => setOpen(false)}>
                <User size={16} /> Profile
              </NavLink>
              <Link to="/reserve" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                Book a Table
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={() => setOpen(false)}>Sign In</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="navbar-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}
