import React, { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  FaSearch, FaCalendarAlt, FaClock, FaVideo, FaCheckCircle,
  FaStar, FaStarHalfAlt, FaRegStar, FaEye, FaDownload
} from "react-icons/fa";
import "./SessionHistory.css";

// ---- Mock data (swap with API later) ----
const SESSIONS = [
  {
    id: "s1",
    therapist: "Dr. Sarah Johnson",
    date: "2025-01-08",  // ISO
    time: "14:00",       // 24h HH:mm
    durationMin: 50,
    type: "video",
    status: "completed",
    rating: 5,
    notes: "Discussed anxiety management techniques and coping strategies for work stress."
  },
  {
    id: "s2",
    therapist: "Dr. Emily Rodriguez",
    date: "2025-01-01",
    time: "11:00",
    durationMin: 50,
    type: "video",
    status: "completed",
    rating: 4.5,
    notes: "Practiced grounding and reframing thoughts. Homework: gratitude journal 5 mins/day."
  },
  {
    id: "s3",
    therapist: "Dr. Michael Chen",
    date: "2024-12-10",
    time: "10:00",
    durationMin: 50,
    type: "video",
    status: "completed",
    rating: 4,
    notes: "Reviewed CBT worksheet. Plan: weekly check-ins for next month."
  }
];

// ---- Helpers ----
const monthKey = (iso) => iso.slice(0, 7);
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (t24) =>
  new Date(`1970-01-01T${t24}:00`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function Stars({ value = 0 }) {
  const arr = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) arr.push(<FaStar key={i} />);
    else if (value > i - 1 && value < i) arr.push(<FaStarHalfAlt key={i} />);
    else arr.push(<FaRegStar key={i} />);
  }
  return <div className="shist-stars">{arr}</div>;
}

export default function SessionHistory() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [range, setRange] = useState("all"); // all | 30 | 90 | 365

  const now = useMemo(() => new Date(), []);

  const filtered = useMemo(() => {
    const rx = q.trim() ? new RegExp(q.trim(), "i") : null;
    const days = range === "all" ? null : Number(range);
    const startCut = days ? new Date(now.getTime() - days * 24 * 60 * 60 * 1000) : null;

    return SESSIONS.filter((s) => {
      const matchesQ = !rx || rx.test(s.therapist) || rx.test(s.notes);
      const matchesType = type === "all" || s.type === type;
      const withinRange = !startCut || new Date(s.date) >= startCut;
      return matchesQ && matchesType && withinRange;
    });
  }, [q, type, range, now]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const thisMonth = filtered.filter((s) => monthKey(s.date) === monthKey(now.toISOString())).length;
    const avg = total ? Math.round((filtered.reduce((a, b) => a + (b.rating || 0), 0) / total) * 10) / 10 : 0;
    const totalHours = Math.round((filtered.reduce((a, b) => a + (b.durationMin || 0), 0) / 60) * 10) / 10;
    return { total, thisMonth, avg, totalHours };
  }, [filtered, now]);

  const exportCSV = () => {
    const header = ["Therapist","Date","Time","Duration(min)","Type","Status","Rating","Notes"];
    const rows = filtered.map(s => [
      s.therapist, s.date, s.time, s.durationMin, s.type, s.status, s.rating ?? "",
      (s.notes || "").replace(/\n/g, " ")
    ]);
    const csv = header.join(",")+"\n"+rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `consultation-history-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadNotes = (s) => {
    const text = `Therapist: ${s.therapist}
Date: ${fmtDate(s.date)} ${fmtTime(s.time)}
Duration: ${s.durationMin} minutes
Type: ${s.type}
Status: ${s.status}
Rating: ${s.rating ?? "-"}
---
Notes:
${s.notes || "-"}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `session-${s.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="shist-root">
      <Sidebar active="History" />
      <main className="shist-main">
        <div className="shist-header">
          <h1>Consultation History</h1>
          <p>Review your past therapy sessions and progress</p>
        </div>

        {/* Stats */}
        <div className="shist-stats">
          <div className="shist-stat">
            <div className="stat-title">Total Sessions</div>
            <div className="stat-row"><div className="stat-value">{stats.total}</div><FaCalendarAlt className="stat-ico" /></div>
          </div>
          <div className="shist-stat">
            <div className="stat-title">This Month</div>
            <div className="stat-row"><div className="stat-value">{stats.thisMonth}</div><FaClock className="stat-ico" /></div>
          </div>
          <div className="shist-stat">
            <div className="stat-title">Avg. Rating</div>
            <div className="stat-row"><div className="stat-value">{stats.avg}</div><FaStar className="stat-ico" /></div>
          </div>
          <div className="shist-stat">
            <div className="stat-title">Total Hours</div>
            <div className="stat-row"><div className="stat-value">{stats.totalHours}</div><FaClock className="stat-ico" /></div>
          </div>
        </div>

        {/* Filters */}
        <div className="shist-filter">
          <div className="shist-search">
            <FaSearch />
            <input
              placeholder="Search by therapist or notes"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <select value={type} onChange={(e)=>setType(e.target.value)} className="shist-select">
            <option value="all">Session Type</option>
            <option value="video">Video Call</option>
            <option value="text">Text Chat</option>
          </select>

          <select value={range} onChange={(e)=>setRange(e.target.value)} className="shist-select">
            <option value="all">Time Period</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 12 months</option>
          </select>
        </div>

        {/* Section header */}
        <div className="shist-section-head">
          <h3>Session History</h3>
          <button className="shist-export" onClick={exportCSV}>
            <FaDownload /> <span>Export Report</span>
          </button>
        </div>

        {/* Cards */}
        <div className="shist-list">
          {filtered.length === 0 ? (
            <div className="shist-empty">No sessions found for the selected filters.</div>
          ) : (
            filtered.map((s) => (
              <div key={s.id} className="shist-card">
                <div className="shist-card-top">
                  <div className="shist-avatar" />
                  <div className="shist-info">
                    <div className="shist-name">{s.therapist}</div>
                    <div className="shist-meta">
                      <span className="chip-light"><FaCalendarAlt /> {fmtDate(s.date)}</span>
                      <span className="chip-light"><FaClock /> {fmtTime(s.time)}</span>
                      <span className="chip-light">{s.durationMin} minutes</span>
                    </div>
                  </div>
                  <div className="shist-right">
                    <div className="shist-tags">
                      <span className="chip"><FaVideo /> Video Call</span>
                      <span className="chip success"><FaCheckCircle /> Completed</span>
                    </div>
                    <Stars value={s.rating || 0} />
                  </div>
                </div>

                <div className="shist-notes">
                  <div className="shist-notes-title">Session Notes</div>
                  <div className="shist-notes-text">{s.notes || "-"}</div>
                </div>

                <div className="shist-actions">
                  <button className="btn-light"><FaEye /> <span>View Details</span></button>
                  <button className="btn-light" onClick={()=>downloadNotes(s)}><FaDownload /> <span>Download</span></button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
