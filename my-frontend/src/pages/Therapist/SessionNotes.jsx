import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHeart, FiHome, FiUser, FiMessageCircle, FiClock,
  FiCalendar, FiStar, FiDollarSign, FiSearch, FiDownload, FiFileText,
  FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import "./SessionNotes.css";

/* --------------------------- mock auth --------------------------- */
function useAuthLocal() {
  const user = { name: "Dr. Smith", role: "Therapist" };
  const logout = () => { localStorage.removeItem("token"); window.location = "/auth/therapist"; };
  return { user, logout };
}

/* ---------------------------- sidebar ---------------------------- */
function SideNav() {
  const { user, logout } = useAuthLocal();
  const navigate = useNavigate();
  const MENU = [
    { label: "Dashboard",           icon: <FiHome/>,          to: "/therapist/dashboard" },
    { label: "Profile",             icon: <FiUser/>,          to: "/therapist/profile" },
    { label: "Patient Interaction", icon: <FiMessageCircle/>, to: "/therapist/patients" },
    { label: "Session History",     icon: <FiClock/>,         to: "/therapist/history" },
  ];
  return (
    <aside className="side-nav">
      <div className="side-header" onClick={() => navigate("/")} role="button" tabIndex={0}>
        <span className="side-logo-bg"><FiHeart className="side-logo" /></span>
        <span className="side-appname">SwasthaMann</span>
        <span className="side-portal">Therapist Portal</span>
      </div>
      <nav className="side-menu">
        {MENU.map(m => (
          <NavLink key={m.label} to={m.to} title={m.label}
            className={({isActive}) => "side-link" + (isActive ? " active" : "")} end>
            <span className="side-icon">{m.icon}</span>
            <span className="side-text">{m.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="side-bottom">
        <div className="side-user">
          <div className="side-user-avatar">DS</div>
          <div>
            <div className="side-user-name">{user.name}</div>
            <div className="side-user-role">{user.role}</div>
          </div>
        </div>
        <button className="side-logout" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}

/* ---------------------------- helpers ---------------------------- */
const StarRow = ({ value=0 }) => (
  <span className="sh-stars" aria-label={`${value} star rating`}>
    {Array.from({length:5}).map((_,i)=>(
      <FiStar key={i} className={"sh-star"+(i<value?" on":"")} />
    ))}
  </span>
);
const Badge = ({ children }) => <span className="sh-badge">{children}</span>;
const fmtDate = (iso) => {
  const d = new Date(iso);
  return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
};

/* ----------------------------- data ------------------------------ */
const SESSIONS = [
  { id:1, name:"John D.",    initials:"JD", date:"2024-01-08", time:"2:00 PM",  duration:50, fee:150, rating:5, mode:"Video Call", status:"Completed",
    notes:"Patient showed significant improvement in anxiety management. Discussed coping strategies for work stress."
  },
  { id:2, name:"Sarah M.",   initials:"SM", date:"2024-01-05", time:"11:00 AM", duration:50, fee:150, rating:5, mode:"Video Call", status:"Completed",
    notes:"Continued work on depression symptoms. Patient reported better sleep patterns and mood stability."
  },
  { id:3, name:"Michael R.", initials:"MR", date:"2024-01-03", time:"3:00 PM",  duration:50, fee:150, rating:4, mode:"Text Chat", status:"Completed",
    notes:"Initial trauma assessment completed. Established therapeutic goals and treatment plan."
  },
  { id:4, name:"Emily K.",   initials:"EK", date:"2023-12-28", time:"1:00 PM",  duration:50, fee:150, rating:5, mode:"Video Call", status:"Completed",
    notes:"Family therapy session. Improved communication patterns observed between family members."
  },
];

/* ------------------------------ page ----------------------------- */
export default function TherapistSessionNotes() {
  // KPI mock
  const totalSessions = 156, thisMonth = 24, avgRating = 4.9, revenue = 3600;

  // filters
  const [q, setQ] = useState("");
  const [type, setType] = useState("");      // All | Video | Chat
  const [period, setPeriod] = useState("");  // 30d | 90d | YTD, etc. (mocked)
  const [minRating, setMinRating] = useState(""); // 3/4/5

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = useMemo(() => {
    let list = [...SESSIONS];
    if (q.trim()) list = list.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
    if (type) list = list.filter(s => (type==="Video" ? s.mode==="Video Call" : s.mode==="Text Chat"));
    if (minRating) list = list.filter(s => s.rating >= Number(minRating));
    // period is visual only in this mock
    return list;
  }, [q, type, minRating]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page-1)*pageSize, page*pageSize);

  const exportReport = () => {
    // Hook up to your real export later
    alert("Exporting report for current filter…");
  };

  return (
    <div className="sh-shell">
      <SideNav />
      <main className="sh-main">
        {/* header */}
        <header className="sh-header">
          <div>
            <h1>Session History</h1>
            <p>Review your past sessions and patient progress</p>
          </div>
          <button className="sh-theme" aria-label="Toggle theme">◐</button>
        </header>

        {/* KPIs */}
        <section className="sh-kpis">
          <div className="sh-kpi">
            <div className="sh-kpi-icon k1"><FiCalendar /></div>
            <div>
              <div className="sh-kpi-label">Total Sessions</div>
              <div className="sh-kpi-value">{totalSessions}</div>
            </div>
          </div>
          <div className="sh-kpi">
            <div className="sh-kpi-icon k2"><FiCalendar /></div>
            <div>
              <div className="sh-kpi-label">This Month</div>
              <div className="sh-kpi-value">{thisMonth}</div>
            </div>
          </div>
          <div className="sh-kpi">
            <div className="sh-kpi-icon k3"><FiClock /></div>
            <div>
              <div className="sh-kpi-label">Avg. Rating</div>
              <div className="sh-kpi-value">{avgRating}</div>
            </div>
          </div>
          <div className="sh-kpi">
            <div className="sh-kpi-icon k4"><FiDollarSign /></div>
            <div>
              <div className="sh-kpi-label">Revenue</div>
              <div className="sh-kpi-value">${revenue.toLocaleString()}</div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="sh-filter">
          <div className="sh-filter-title">Filter Sessions</div>
          <div className="sh-filter-row">
            <div className="sh-search">
              <FiSearch />
              <input placeholder="Search by patient name" value={q} onChange={(e)=>{ setPage(1); setQ(e.target.value); }} />
            </div>

            <select className="sh-select" value={type} onChange={(e)=>{ setPage(1); setType(e.target.value); }}>
              <option value="">Session Type</option>
              <option value="Video">Video Call</option>
              <option value="Chat">Text Chat</option>
            </select>

            <select className="sh-select" value={period} onChange={(e)=>setPeriod(e.target.value)}>
              <option value="">Time Period</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="ytd">Year to date</option>
            </select>

            <select className="sh-select" value={minRating} onChange={(e)=>{ setPage(1); setMinRating(e.target.value); }}>
              <option value="">Rating</option>
              <option value="5">5 stars</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
            </select>
          </div>
        </section>

        {/* History list */}
        <section className="sh-list">
          <div className="sh-list-head">
            <h2>Session History</h2>
            <button className="sh-ghost" onClick={exportReport}><FiDownload /> Export Report</button>
          </div>

          <ul className="sh-items">
            {pageData.map(s => (
              <li key={s.id} className="sh-item">
                <div className="sh-left">
                  <div className="sh-avatar">{s.initials}</div>
                  <div className="sh-meta">
                    <div className="sh-name">{s.name}</div>
                    <div className="sh-sub">
                      <span className="sh-chip"><FiCalendar /> {fmtDate(s.date)}</span>
                      <span className="sh-dot">•</span>
                      <span className="sh-chip"><FiClock /> {s.time}</span>
                      <span className="sh-dot">•</span>
                      <span className="sh-chip">{s.duration} minutes</span>
                    </div>
                  </div>
                </div>

                <div className="sh-right">
                  <div className="sh-right-top">
                    <div className="sh-fee">${s.fee}</div>
                    <StarRow value={s.rating} />
                    <span className="sh-mode">{s.mode}</span>
                    <Badge>Completed</Badge>
                  </div>

                  <p className="sh-notes"><b>Session Notes</b><br/>{s.notes}</p>

                  <div className="sh-actions">
                    <button className="sh-btn"><FiFileText /> View Full Notes</button>
                    <button className="sh-btn"><FiDownload /> Download Report</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="sh-footer">
            <div className="sh-count">Showing {pageData.length} of {filtered.length} sessions</div>
            <div className="sh-pager">
              <button className="sh-small" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}><FiChevronLeft/> Previous</button>
              <button className="sh-small" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages, p+1))}>Next <FiChevronRight/></button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
