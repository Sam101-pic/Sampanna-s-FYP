import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHeart, FiHome, FiUser, FiMessageCircle, FiClock,
  FiUpload, FiCheckCircle,
} from "react-icons/fi";
import "./Profile.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* Local auth hook */
function useAuthLocal() {
  const token = localStorage.getItem("token");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location = "/auth/therapist";
  };
  return { token, logout };
}

/* Sidebar */
function SideNav() {
  const { logout } = useAuthLocal();
  const navigate = useNavigate();
  const MENU = [
    { label: "Dashboard", icon: <FiHome />, to: "/therapist/dashboard" },
    { label: "Profile", icon: <FiUser />, to: "/profile/therapist" },
    { label: "Patient Interaction", icon: <FiMessageCircle />, to: "/therapist/interactions" },
    { label: "Session History", icon: <FiClock />, to: "/therapist/history" },
  ];
  return (
    <aside className="side-nav">
      <div className="side-header" onClick={() => navigate("/")} role="button" tabIndex={0}>
        <span className="side-logo-bg"><FiHeart className="side-logo" /></span>
        <span className="side-appname">SwasthaMann</span>
        <span className="side-portal">Therapist Portal</span>
      </div>
      <nav className="side-menu">
        {MENU.map((m) => (
          <NavLink
            key={m.label}
            to={m.to}
            className={({ isActive }) => "side-link" + (isActive ? " active" : "")}
            end
          >
            <span className="side-icon">{m.icon}</span>
            <span className="side-text">{m.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="side-bottom">
        <div className="side-user">
          <div className="side-user-avatar">T</div>
          <div>
            <div className="side-user-name">Therapist</div>
            <div className="side-user-role">Profile</div>
          </div>
        </div>
        <button className="side-logout" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}

export default function Profile() {
  useEffect(() => {
    document.body.classList.add("no-chrome");
    return () => document.body.classList.remove("no-chrome");
  }, []);

  const { token } = useAuthLocal();
  const [tab, setTab] = useState("profile");

  // --- state
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [rate, setRate] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [specToAdd, setSpecToAdd] = useState("");
  const [langToAdd, setLangToAdd] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [education, setEducation] = useState("");
  const [days, setDays] = useState([
    { day: "Monday", on: false, from: "", to: "" },
    { day: "Tuesday", on: false, from: "", to: "" },
    { day: "Wednesday", on: false, from: "", to: "" },
    { day: "Thursday", on: false, from: "", to: "" },
    { day: "Friday", on: false, from: "", to: "" },
    { day: "Saturday", on: false, from: "", to: "" },
    { day: "Sunday", on: false, from: "", to: "" },
  ]);

  // --- fetch existing profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `${API_URL}/therapists/profile/${localStorage.getItem("userId")}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setAvatarUrl(data.avatarUrl || "");
        setBio(data.bio || "");
        setRate(data.fee || "");
        setSpecializations(data.specialties || []);
        setLanguages(data.languages || []);
        setLicenseNo(data.license || "");
        setYearsExp(data.experience || "");
        setEducation(data.education || "");
        if (data.availability) setDays(data.availability);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  // --- upload photo
  const onUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const formData = new FormData();
    formData.append("avatar", f);
    const res = await fetch(`${API_URL}/users/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (data.url) setAvatarUrl(data.url);
  };

  /* ---------------- Save handlers ---------------- */
  const saveProfile = async () => {
    try {
      const payload = { bio, rate, specializations, languages, avatarUrl };
      const res = await fetch(`${API_URL}/therapists/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      alert("✅ Profile info saved");
    } catch (err) {
      console.error("Save profile error:", err);
    }
  };

  const saveQualifications = async () => {
    try {
      const payload = { licenseNo, yearsExp, education };
      const res = await fetch(`${API_URL}/therapists/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save qualifications");
      alert("✅ Qualifications saved");
    } catch (err) {
      console.error("Save qualifications error:", err);
    }
  };

  const saveAvailability = async () => {
    try {
      const payload = { availability: days };
      const res = await fetch(`${API_URL}/therapists/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save availability");
      alert("✅ Availability saved");
    } catch (err) {
      console.error("Save availability error:", err);
    }
  };

  // --- day handlers
  const toggleDay = (i) => setDays(days.map((d, idx) => (idx === i ? { ...d, on: !d.on } : d)));
  const setDayField = (i, key, val) =>
    setDays(days.map((d, idx) => (idx === i ? { ...d, [key]: val } : d)));

  return (
    <div className="tp-shell">
      <SideNav />

      <main className="tp-main">
        <header className="tp-header">
          <div>
            <h1>Profile Management</h1>
            <p>Update your professional information and availability</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="tp-tabs">
          <button className={"tp-tab" + (tab === "profile" ? " active" : "")} onClick={() => setTab("profile")}>Profile Information</button>
          <button className={"tp-tab" + (tab === "qualifications" ? " active" : "")} onClick={() => setTab("qualifications")}>Qualifications</button>
          <button className={"tp-tab" + (tab === "availability" ? " active" : "")} onClick={() => setTab("availability")}>Availability</button>
        </div>

        {/* Profile Info */}
        {tab === "profile" && (
          <section className="tp-panels">
            <div className="tp-card">
              <h3 className="tp-card-title">Profile Photo</h3>
              <div className="tp-photo">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="tp-photo-circle" />
                ) : (
                  <div className="tp-photo-circle">?</div>
                )}
                <label className="tp-upload">
                  <FiUpload /> Upload New Photo
                  <input type="file" accept="image/*" onChange={onUpload} hidden />
                </label>
              </div>
            </div>

            <div className="tp-stack">
              <div className="tp-card">
                <h3 className="tp-card-title">Basic Information</h3>
                <label>Professional Bio<textarea className="tp-textarea" value={bio} onChange={(e) => setBio(e.target.value)} /></label>
                <label>Session Rate (USD)<input className="tp-input" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
              </div>

              <div className="tp-card">
                <h3 className="tp-card-title">Specializations & Languages</h3>
                <div className="tp-chipset">
                  <div className="tp-chipset-label">Specializations</div>
                  <div className="tp-chips">
                    {specializations.map((s) => <span key={s} className="tp-chip">{s}</span>)}
                  </div>
                  <div className="tp-add-row">
                    <input className="tp-input" placeholder="Add specialization" value={specToAdd} onChange={(e) => setSpecToAdd(e.target.value)} />
                    <button className="tp-btn" onClick={() => { if (specToAdd) setSpecializations([...specializations, specToAdd]); setSpecToAdd(""); }}>Add</button>
                  </div>
                </div>
                <div className="tp-chipset">
                  <div className="tp-chipset-label">Languages</div>
                  <div className="tp-chips">
                    {languages.map((l) => <span key={l} className="tp-chip">{l}</span>)}
                  </div>
                  <div className="tp-add-row">
                    <input className="tp-input" placeholder="Add language" value={langToAdd} onChange={(e) => setLangToAdd(e.target.value)} />
                    <button className="tp-btn" onClick={() => { if (langToAdd) setLanguages([...languages, langToAdd]); setLangToAdd(""); }}>Add</button>
                  </div>
                </div>
              </div>

              <div className="tp-savebar">
                <button className="tp-primary" onClick={saveProfile}><FiCheckCircle /> Save Profile Changes</button>
              </div>
            </div>
          </section>
        )}

        {/* Qualifications */}
        {tab === "qualifications" && (
          <section className="tp-panels single">
            <div className="tp-card">
              <h3 className="tp-card-title">Professional Qualifications</h3>
              <label>License Number<input className="tp-input" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} /></label>
              <label>Years of Experience<input className="tp-input" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} /></label>
              <label>Education<textarea className="tp-textarea" value={education} onChange={(e) => setEducation(e.target.value)} /></label>
              <div className="tp-savebar">
                <button className="tp-primary" onClick={saveQualifications}><FiCheckCircle /> Save Qualifications</button>
              </div>
            </div>
          </section>
        )}

        {/* Availability */}
        {tab === "availability" && (
          <section className="tp-panels single">
            <div className="tp-card">
              <h3 className="tp-card-title">Availability Schedule</h3>
              <div className="tp-days">
                {days.map((d, i) => (
                  <div key={d.day} className={"tp-day" + (!d.on ? " off" : "")}>
                    <label className="tp-day-left">
                      <input type="checkbox" checked={d.on} onChange={() => toggleDay(i)} />
                      <span>{d.day}</span>
                    </label>
                    <div className="tp-day-right">
                      <input type="time" value={d.from} onChange={(e) => setDayField(i, "from", e.target.value)} disabled={!d.on} />
                      <span className="tp-to">to</span>
                      <input type="time" value={d.to} onChange={(e) => setDayField(i, "to", e.target.value)} disabled={!d.on} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="tp-savebar">
                <button className="tp-primary" onClick={saveAvailability}><FiCheckCircle /> Save Availability</button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
