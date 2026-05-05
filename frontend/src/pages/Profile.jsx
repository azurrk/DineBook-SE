import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiUpdateProfile } from "../services/backend";
import { User, Mail, Phone, Save, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import "./Profile.css";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone || "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    return e;
  };

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
    setDirty(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const { user: updated } = await apiUpdateProfile({ userId: user.id, ...form });
      updateUser(updated);
      setDirty(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page profile-page">
      <div className="profile-layout">
        {/* Sidebar card */}
        <div className="profile-sidebar">
          <div className="card profile-avatar-card">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p className="profile-email">{user.email}</p>
            {user.createdAt && (
              <p className="profile-since">
                <CalendarDays size={13} />
                Member since {format(new Date(user.createdAt), "MMM yyyy")}
              </p>
            )}
          </div>
        </div>

        {/* Main form */}
        <div>
          <div className="card profile-form-card">
            <h3 className="profile-section-title">Personal Information</h3>
            <p className="profile-section-sub">Update your name, email, and contact details</p>

            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group">
                <label><User size={13} /> Full Name</label>
                <input type="text" value={form.name} onChange={set("name")} placeholder="Your full name" />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label><Mail size={13} /> Email Address</label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label><Phone size={13} /> Phone Number <span className="optional">(optional)</span></label>
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+387 61 123 456" />
              </div>

              <div className="profile-form-footer">
                {dirty && <span className="unsaved-note">You have unsaved changes</span>}
                <button type="submit" className="btn btn-primary" disabled={saving || !dirty}>
                  {saving ? <><span className="spinner" /> Saving...</> : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
