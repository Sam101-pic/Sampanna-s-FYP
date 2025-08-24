// src/pages/therapist/TherapistDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiHome, FiUser, FiMessageCircle, FiClock, FiHeart,
  FiCalendar, FiStar, FiDollarSign, FiVideo, FiMessageSquare,
  FiChevronRight, FiLogIn
} from "react-icons/fi";
import { io } from "socket.io-client";
import "./TherapistDashboard.css";

const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ===================== KPIs (static for now) ===================== */
const KPIS = [
  { label: "Today's Sessions", value: 6, icon: <FiCalendar />, accent: "#7c3aed" },
  { label: "Active Patients", value: 24, icon: <FiUser />,     accent: "#059669" },
  { label: "Avg. Rating",     value: 4.9, icon: <FiStar />,     accent: "#f59e0b" },
  { label: "This Month",      value: "$3,200", icon: <FiDollarSign />, accent: "#6b7280" },
];

/* ===================== Feedback (mock) ===================== */
const FEEDBACK = [
  { stars:5, text:"“Dr. Smith is incredibly understanding and provides excellent guidance.”", by:"Anonymous", time:"2 days ago" },
  { stars:5, text:"“The session was very helpful. I feel much better after our conversation.”", by:"Anonymous", time:"1 week ago" },
  { stars:4, text:"“Great therapist, very professional and caring.”", by:"Anonymous", time:"2 weeks ago" },
];

const Badge = ({ text, tone = "neutral" }) => (
  <span className={`td-badge td-badge--${tone}`}>{text}</span>
);
const StarRow = ({ count }) => (
  <div className="td-stars" aria-label={`${count} star rating`}> 
    {Array.from({ length: 5 }).map((_, i) => (
      <FiStar key={i} className={i < count ? "td-star td-star--on" : "td-star"} />
    ))}
  </div>
);
const QuickAction = ({ to, icon, label }) => (
  <Link to={to} className="td-qa">
    <span className="td-qa-icon">{icon}</span>
    <span>{label}</span>
  </Link>
);

/* ===================== Sidebar ===================== */
function SideNav({ me }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/auth/therapist";
  };

  const MENU = [
    { label: "Dashboard",           icon: <FiHome/>,          to: "/therapist/dashboard" },
    { label: "Profile",             icon: <FiUser/>,          to: "/profile/therapist"   },
    { label: "Patient Interaction", icon: <FiMessageCircle/>, to: "/therapist/interactions" },
    { label: "Session History",     icon: <FiClock/>,         to: "/therapist/history"   },
  ];

  return (
    <aside className="side-nav" aria-label="Sidebar navigation">
      <div className="side-header" onClick={() => navigate("/")} role="button" tabIndex={0}>
        <span className="side-logo-bg"><FiHeart className="side-logo" /></span>
        <span className="side-appname">SwasthaMann</span>
        <span className="side-portal">Therapist Portal</span>
      </div>

      <nav className="side-menu">
        {MENU.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            title={item.label}
            className={({ isActive }) => "side-link" + (isActive ? " active" : "")}
            end
          >
            <span className="side-icon">{item.icon}</span>
            <span className="side-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="side-bottom">
        <div className="side-user">
          <div className="side-user-avatar">
            {me?.name ? me.name.split(" ").map(n => n[0]).join("") : "?"}
          </div>
          <div>
            <div className="side-user-name">{me?.name || "Unknown"}</div>
            <div className="side-user-role">{me?.role || ""}</div>
          </div>
        </div>
        <button className="side-logout" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}

/* ===================== Main Dashboard ===================== */
export default function TherapistDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [me, setMe] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch logged-in therapist info
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMe(data);
      } catch (err) {
        console.error("Failed to load therapist profile:", err);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  // Fetch appointments
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/appointments?scope=upcoming`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (Array.isArray(data.items)) setAppointments(data.items);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      }
    }
    if (token) fetchAppointments();
  }, [token]);

  // Fetch therapists initially
  useEffect(() => {
    async function fetchTherapists() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/therapists`);
        const data = await res.json();
        setTherapists(data.items || []);
      } catch (err) {
        console.error("Failed to load therapists:", err);
      }
    }
    fetchTherapists();
  }, []);

  // Socket for real-time therapist registration
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socket.on("therapist:registered", (newTherapist) => {
      setTherapists((prev) => [newTherapist, ...prev]);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="td-shell">
      <SideNav me={me} />

      <main className="td-main">
        <header className="td-header">
          <div>
            <h1>Welcome back, {me?.name || "Therapist"}!</h1>
            <p>Here's your practice overview for today</p>
          </div>
          <button type="button" className="td-theme-toggle" aria-label="Toggle theme">◐</button>
        </header>

        {/* KPIs */}
        <section className="td-kpis">
          {KPIS.map(({ label, value, icon, accent }) => (
            <div className="td-kpi" key={label} style={{ borderColor: `${accent}55` }}>
              <div className="td-kpi-icon" style={{ color: accent, background: `${accent}15` }}>
                {icon}
              </div>
              <div className="td-kpi-meta">
                <div className="td-kpi-label">{label}</div>
                <div className="td-kpi-value">{value}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Panels */}
        <section className="td-panels">
          {/* Schedule */}
          <div className="td-panel">
            <div className="td-panel-head">
              <div>
                <h2>Today's Schedule</h2>
                <p>Your upcoming sessions for today</p>
              </div>
              <Link to="/appointments" className="td-ghost-btn">
                View All <FiChevronRight />
              </Link>
            </div>

            <ul className="td-schedule">
              {appointments.length === 0 && (
                <li className="td-schedule-row empty">No appointments today</li>
              )}

              {appointments.map((appt) => (
                <li className="td-schedule-row" key={appt.id}>
                  <div className="td-chip" style={{ background: "#2563eb15", color: "#2563eb" }}>
                    {appt.patientId?.name
                      ? appt.patientId.name.split(" ").map((n) => n[0]).join("")
                      : "PT"}
                  </div>

                  <div className="td-s-person">
                    <div className="td-s-name">{appt.patientId?.name || "Patient"}</div>
                    <div className="td-s-sub">
                      <span>
                        {new Date(appt.datetime).toLocaleTimeString([], {
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                      <span>({appt.durationMin || 50} min)</span>
                    </div>
                  </div>

                  <div className="td-s-mode">
                    {appt.type === "video" ? <FiVideo /> : <FiMessageSquare />}
                    <span>{appt.type === "video" ? "Video Call" : "Text Chat"}</span>
                  </div>

                  <div className="td-s-status">
                    <Badge
                      tone={
                        appt.status === "scheduled"
                          ? "success"
                          : appt.status === "pending"
                          ? "warning"
                          : "neutral"
                      }
                      text={appt.status}
                    />
                  </div>

                  <Link to={`/appointments/${appt.id}/join`} className="td-join">
                    <FiLogIn /> Join
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Feedback */}
          <div className="td-panel">
            <div className="td-panel-head">
              <h2>Recent Feedback</h2>
              <Link to="/reviews/ratings" className="td-ghost-btn">
                View All <FiChevronRight />
              </Link>
            </div>

            <ul className="td-feedback">
              {FEEDBACK.map((f, i) => (
                <li className="td-feedback-card" key={i}>
                  <div className="td-feedback-top">
                    <StarRow count={f.stars} />
                    <span className="td-time">{f.time}</span>
                  </div>
                  <p className="td-quote">{f.text}</p>
                  <div className="td-by">— {f.by}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Therapists Panel */}
        <section className="td-panel" style={{ marginTop: "20px" }}>
          <div className="td-panel-head">
            <h2>Registered Therapists</h2>
          </div>
          <ul className="td-schedule">
            {therapists.length === 0 && (
              <li className="td-schedule-row empty">No therapists found</li>
            )}
            {therapists.map((t) => (
              <li key={t.id} className="td-schedule-row">
                <div className="td-chip" style={{ background:"#e0e7ff", color:"#3730a3" }}>
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="td-s-person">
                  <div className="td-s-name">{t.name}</div>
                  <div className="td-s-sub">{t.headline || "No specialization"}</div>
                </div>
                <div className="td-s-mode">
                  <span>{t.location || "N/A"}</span>
                </div>
                <div className="td-s-status">
                  <Badge tone="success" text="Active" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick actions */}
        <section className="td-qa-row">
          <QuickAction to="/therapist/interactions" icon={<FiMessageCircle />} label="Patient Chat" />
          <QuickAction to="/profile/therapist"      icon={<FiUser />} label="Update Profile" />
          <QuickAction to="/therapist/history"      icon={<FiStar />} label="View Analytics" />
          <QuickAction to="/availability"           icon={<FiCalendar />} label="Set Availability" />
        </section>
      </main>
    </div>
  );
}
