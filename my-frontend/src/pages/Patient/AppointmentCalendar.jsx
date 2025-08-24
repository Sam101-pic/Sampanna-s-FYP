// src/pages/appointments/AppointmentCalendar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  FaCalendarAlt, FaClock, FaVideo, FaCheck, FaTrash, FaPen,
} from "react-icons/fa";
import api from "../../services/api"; // your axios instance
import "./AppointmentCalendar.css";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function AppointmentCalendar() {
  const [tab, setTab] = useState("upcoming"); // 'upcoming' | 'book' | 'history'

  const [upcoming, setUpcoming] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch appointments from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [upRes, histRes] = await Promise.all([
          api.get("/appointments?scope=upcoming"),
          api.get("/appointments?scope=history"),
        ]);

        setUpcoming(upRes.data.items || []);
        setHistory(histRes.data.items || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoin = async (appt) => {
    const id = appt._id || appt.id;
    if (!id) return;
    try {
      setJoiningId(id);
      const { data } = await api.post(`/appointments/${id}/join`);
      if (data?.url) {
        window.open(data.url, "_blank", "noopener");
      } else {
        alert("Join link not available yet.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Unable to get join link. Join opens 15 minutes before session.";
      alert(msg);
    } finally {
      setJoiningId(null);
    }
  };

  const handleCancel = async (appt) => {
    const id = appt._id || appt.id;
    if (!id) return;
    const ok = window.confirm(`Cancel appointment with ${appt.therapistId?.name || "therapist"}?`);
    if (!ok) return;

    setCancellingId(id);
    const snapshot = [...upcoming];
    setUpcoming((prev) => prev.filter((x) => (x._id || x.id) !== id));

    try {
      await api.delete(`/appointments/${id}`);
    } catch (err) {
      setUpcoming(snapshot); // rollback
      const msg = err?.response?.data?.message || "Failed to cancel appointment.";
      alert(msg);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="ac-root">
      <Sidebar active="Appointments" />

      <main className="ac-main">
        <header className="ac-header">
          <h1>Appointments</h1>
          <p>Manage your therapy sessions and bookings</p>
        </header>

        {/* Tabs */}
        <nav className="ac-tabs" role="tablist" aria-label="Appointment sections">
          <button
            role="tab"
            className={`ac-tab ${tab === "upcoming" ? "is-active" : ""}`}
            aria-selected={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            role="tab"
            className={`ac-tab ${tab === "book" ? "is-active" : ""}`}
            aria-selected={tab === "book"}
            onClick={() => setTab("book")}
          >
            Book New
          </button>
          <button
            role="tab"
            className={`ac-tab ${tab === "history" ? "is-active" : ""}`}
            aria-selected={tab === "history"}
            onClick={() => setTab("history")}
          >
            History
          </button>
        </nav>

        {/* Panel */}
        <section className="ac-panel">
          {tab === "upcoming" && (
            <>
              <div className="ac-panel-title">
                <h3>Upcoming Appointments</h3>
                <p>Your scheduled therapy sessions</p>
              </div>

              {loading ? (
                <div className="ac-empty">Loading…</div>
              ) : upcoming.length === 0 ? (
                <div className="ac-empty">You have no upcoming appointments.</div>
              ) : (
                <div className="ac-list">
                  {upcoming.map((a) => {
                    const id = a._id || a.id;
                    const isJoining = joiningId === id;
                    const isCancelling = cancellingId === id;
                    return (
                      <article key={id} className={`ac-appt ${isCancelling ? "is-disabled" : ""}`}>
                        <div className="ac-avatar" aria-hidden />
                        <div className="ac-info">
                          <div className="ac-therapist">
                            {a.therapistId?.name || "Therapist"}
                          </div>
                          <div className="ac-meta">
                            <span><FaCalendarAlt /> {formatDate(a.datetime)}</span>
                            <span><FaClock /> {formatTime(a.datetime)}</span>
                            <span>({a.durationMin} minutes)</span>
                          </div>
                          <div className="ac-badges">
                            <span className="ac-pill">{a.type}</span>
                            <span className="ac-pill ac-pill--ok">
                              <FaCheck /> {a.status}
                            </span>
                          </div>
                        </div>

                        <div className="ac-actions">
                          {/* JOIN */}
                          <button
                            className="ac-join"
                            onClick={() => handleJoin(a)}
                            disabled={isJoining || isCancelling}
                          >
                            <FaVideo /> <span>{isJoining ? "Preparing…" : "Join"}</span>
                          </button>

                          {/* RESCHEDULE */}
                          <Link
                            to={`/appointments/reschedule/${id}`}
                            state={{ datetime: a.datetime }}
                            className="ac-iconbtn"
                          >
                            <FaPen />
                          </Link>

                          {/* CANCEL */}
                          <button
                            className="ac-iconbtn"
                            onClick={() => handleCancel(a)}
                            disabled={isCancelling || isJoining}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {tab === "book" && (
            <div className="ac-book">
              <h3>Book a New Session</h3>
              <p className="ac-help">Choose a therapist and time that works for you.</p>
              <div className="ac-book-grid">
                <Link to="/therapists" className="ac-cta">Find Therapist</Link>
                <Link to="/appointments/calendar" className="ac-cta ac-cta--outline">
                  Open Calendar
                </Link>
              </div>
            </div>
          )}

          {tab === "history" && (
            <>
              <div className="ac-panel-title">
                <h3>Past Sessions</h3>
                <p>Your completed appointments</p>
              </div>
              <div className="ac-list">
                {history.length === 0 ? (
                  <div className="ac-empty">No past sessions.</div>
                ) : (
                  history.map((a) => (
                    <article key={a._id || a.id} className="ac-appt">
                      <div className="ac-avatar" aria-hidden />
                      <div className="ac-info">
                        <div className="ac-therapist">{a.therapistId?.name || "Therapist"}</div>
                        <div className="ac-meta">
                          <span><FaCalendarAlt /> {formatDate(a.datetime)}</span>
                          <span><FaClock /> {formatTime(a.datetime)}</span>
                          <span>({a.durationMin} minutes)</span>
                        </div>
                        <div className="ac-badges">
                          <span className="ac-pill">{a.type}</span>
                          <span className="ac-pill ac-pill--ok">
                            <FaCheck /> {a.status}
                          </span>
                        </div>
                      </div>
                      <div className="ac-actions">
                        <Link to="/history" className="ac-join ac-join--muted">
                          View Notes
                        </Link>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
