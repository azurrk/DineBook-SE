import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRegister } from "../services/mockData";
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import "./Auth.css";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Minimum 6 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { user, token } = await apiRegister(form);
      login(user, token);
      toast.success(`Welcome to DineBook, ${user.name.split(" ")[0]}! 🍽️`);
      navigate("/reservations");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: "" })); };

  return (
    <div className="auth-page page-sm">
      <div className="auth-logo">
        <UtensilsCrossed size={28} />
        <span>DineBook</span>
      </div>

      <div className="card auth-card animate-fade-up">
        <div className="auth-header">
          <h2>Create your account</h2>
          <p>Start booking tables in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your full name" value={form.name} onChange={set("name")} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrap">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={set("password")}
              />
              <button type="button" className="input-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} />
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : "Create Account"}
          </button>
        </form>

        <div className="divider">or</div>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
