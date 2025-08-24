import React from "react";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt, FaChartLine, FaHeart, FaClock, FaVideo,
  FaUser, FaStar, FaComments
} from "react-icons/fa";
import "./PatientDashboard.css";

export default function PatientDashboard() {
  const userName = "John";

  const stats = [
    { label: "Total Sessions", value: 12, icon: <FaCalendarAlt /> },
    { label: "This Month", value: 4, icon: <FaClock /> },
    { label: "Progress Score", value: "85%", icon: <FaChartLine /> },
    { label: "Wellness Score", value: "7.8/10", icon: <FaHeart /> }
  ];

  const appointments = [
    { therapist: "Dr. Sarah Johnson", time: "Today at 2:00 PM" },
    { therapist: "Dr. Michael Chen", time: "Tomorrow at 10:00 AM" }
  ];

  const recommendations = [
    { name: "Dr. Emily Rodriguez", specialty: "Anxiety & Depression", rating: 4.9, years: 8, match: "95%" },
    { name: "Dr. James Wilson", specialty: "Trauma & PTSD", rating: 4.8, years: 12, match: "92%" }
  ];

  const actions = [
    { label: "Find Therapist", icon: <FaUser />, to: "/therapists" },
    { label: "Book Session", icon: <FaCalendarAlt />, to: "/appointments/calendar" },
    { label: "Start Chat", icon: <FaComments />, to: "/consultation" },
    { label: "Give Feedback", icon: <FaStar />, to: "/feedback" }
  ];

  return (
    <div className="pdash-root">
      <Sidebar active="Dashboard" />

      <main className="pdash-main">
        <header className="pdash-header">
          <h1>Welcome back, {userName}!</h1>
          <p>Here's your mental health journey overview</p>
        </header>

        {/* Metrics */}
        <section className="pdash-metrics">
          {stats.map((s, i) => (
            <div className="metric-card" key={i}>
              <div className="metric-body">
                <div className="metric-label">{s.label}</div>
                <div className="metric-value">{s.value}</div>
              </div>
              <div className="metric-icon">{s.icon}</div>
            </div>
          ))}
        </section>

        {/* Main row */}
        <section className="pdash-grid">
          {/* Upcoming */}
          <article className="panel panel--ghost">
            <div className="panel-header">
              <h3>Upcoming Appointments</h3>
              <Link to="/appointments/calendar" className="pill">View All</Link>
            </div>

            <div className="appt-list">
              {appointments.map((a, i) => (
                <div className="appt-item" key={i}>
                  <div className="avatar" aria-hidden />
                  <div className="appt-info">
                    <div className="appt-name">{a.therapist}</div>
                    <div className="appt-time">{a.time}</div>
                  </div>
                  <Link to="/video-session" className="join">
                    <FaVideo /> <span>Join</span>
                  </Link>
                </div>
              ))}
            </div>
          </article>

          {/* Recommended */}
          <aside className="panel panel--ghost">
            <div className="panel-header">
              <h3>Recommended for You</h3>
              <Link to="/therapists" className="pill">View All</Link>
            </div>
            <p className="panel-sub">AI-matched therapists based on your preferences</p>

            <div className="rec-list">
              {recommendations.map((r, i) => (
                <div className="rec-card" key={i}>
                  <div className="rec-left">
                    <div className="avatar lg" aria-hidden />
                    <div>
                      <div className="rec-name">{r.name}</div>
                      <div className="rec-spec">{r.specialty}</div>
                      <div className="rec-details">
                        <span>⭐ {r.rating}</span>
                        <span>{r.years} years</span>
                      </div>
                    </div>
                  </div>
                  <div className="rec-right">
                    <span className="match">{r.match} match</span>
                    <div className="rec-actions">
                      <Link to="/appointments/book/123" className="btn-primary">Book Session</Link>
                      <Link to="/consultation" className="btn-icon" aria-label={`Message ${r.name}`}>
                        <FaComments />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {/* Quick actions */}
        <section className="panel quick">
          <h3 className="panel-title">Quick Actions</h3>
          <div className="qa-grid">
            {actions.map((a, i) => (
              <Link to={a.to} className="qa-card" key={i}>
                <span className="qa-icon" aria-hidden>{a.icon}</span>
                <span>{a.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
