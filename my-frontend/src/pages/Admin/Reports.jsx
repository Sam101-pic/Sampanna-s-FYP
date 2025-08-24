import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome, FaUserCog, FaFileAlt, FaCog, FaUserCircle, FaSignOutAlt, FaUserCheck
} from "react-icons/fa";
import {
  FiUsers, FiCalendar, FiDollarSign, FiSearch, FiDownload, FiRefreshCcw, FiEye
} from "react-icons/fi";
import "./Reports.css";

/* mock auth */
function useAuth() {
  const user = { name: "Admin User", role: "Admin" };
  return {
    user,
    logout: () => { localStorage.removeItem("token"); window.location = "/auth/login"; },
  };
}

/* sidebar */
function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const adminMenu = [
    { label: "Dashboard",              icon: <FaHome />,      to: "/dashboard/admin" },
    { label: "User Management",        icon: <FaUserCog />,   to: "/admin/user-management" },
    { label: "Therapist Verification", icon: <FaUserCheck />, to: "/admin/therapist-verification" },
    { label: "Reports",                icon: <FaFileAlt />,   to: "/admin/reports" },
    { label: "Settings",             icon: <FaCog />,       to: "/admin/settings" },
  ];

  return (
    <aside className="side-nav" aria-label="Admin sidebar">
      <div className="side-header" onClick={() => navigate("/dashboard/admin")} role="button" tabIndex={0}>
        <span className="side-logo-bg"><FaUserCog className="side-logo" /></span>
        <span className="side-appname">SwasthaMann</span>
        <span className="side-portal">Admin Portal</span>
      </div>

      <nav className="side-menu">
        {adminMenu.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              "side-link" + (isActive || item.label === "Reports" ? " active" : "")
            }
            end
          >
            <span className="side-icon">{item.icon}</span>
            <span className="side-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="side-bottom">
        <div className="side-user">
          <FaUserCircle className="side-user-icon" />
          <div>
            <div className="side-user-name">{user.name}</div>
            <div className="side-user-role">{user.role}</div>
          </div>
        </div>
        <button className="side-logout" onClick={logout}><FaSignOutAlt /> Logout</button>
      </div>
    </aside>
  );
}

/* mock data */
const KPI = { users: 2847, sessions: 15678, revenue: 245670 };

const DAILY = [
  { date: "Monday, January 15, 2024", completed: 142, cancelled: 14, avgDuration: "45 min", revenue: 7800, therapists: 23, patients: 134, satisfaction: 4.8, sessions: 156 },
  { date: "Sunday, January 14, 2024", completed: 128, cancelled: 6,  avgDuration: "42 min", revenue: 6700, therapists: 21, patients: 119, satisfaction: 4.7, sessions: 134 },
  { date: "Saturday, January 13, 2024", completed: 159, cancelled: 8, avgDuration: "48 min", revenue: 8350, therapists: 25, patients: 148, satisfaction: 4.9, sessions: 167 },
];

const GROWTH = [
  { month: "Jan 2024", patients: 1200, therapists: 85,  totalGrowth: "15.2%", retention: "94.3%" },
  { month: "Feb 2024", patients: 1350, therapists: 92,  totalGrowth: "12.2%", retention: "91.2%" },
  { month: "Mar 2024", patients: 1520, therapists: 98,  totalGrowth: "12.2%", retention: "89.9%" },
];

const FINANCIAL = [
  { month: "January 2024", total: 45230, subs: 32100, consults: 13130, refunds: 1200, net: 44030, avg: 36.28, growth: "+15%" , tx: 1247 },
  { month: "December 2023", total: 39450, subs: 28900, consults: 10550, refunds: 890, net: 38560, avg: 36.23, growth: "+12%" , tx: 1089 },
  { month: "November 2023", total: 35200, subs: 25800, consults: 9400,  refunds: 650, net: 34550, avg: 36.21, growth: "+8%"  , tx: 972  },
];

const COMPLIANCE = [
  { title: "HIPAA Compliance", last: "1/10/2024", next: "4/10/2024", priority: "low",    auditor: "CyberSec Inc.",        status: "Compliant",       score: "98.5%" },
  { title: "Data Security",    last: "1/5/2024",  next: "4/5/2024",  priority: "low",    auditor: "SecureAudit LLC",      status: "Compliant",       score: "97.2%" },
  { title: "Privacy Policy",   last: "12/15/2023",next: "3/15/2024", priority: "medium", auditor: "LegalCompliance Co.",   status: "Review Required", score: "89.1%", issues: 2 },
];

export default function Reports() {
  const [tab, setTab] = useState("sessions");
  const [timeRange, setTimeRange] = useState("30");
  const refresh = () => {};
  const exportAll = () => { alert("Exporting current report view…"); };
  const k = (n) => n.toLocaleString();

  return (
    <div className="ar-shell">
      <AdminSidebar />

      <main className="ar-main">
        {/* Header */}
        <header className="ar-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Comprehensive platform insights and performance metrics</p>
          </div>

          <div className="ar-controls">
            <div className="ar-search">
              <FiSearch />
              <input placeholder="Search reports..." />
            </div>
            <select className="ar-select" value={timeRange} onChange={e=>setTimeRange(e.target.value)}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
            </select>
            <button className="ar-btn" onClick={refresh}><FiRefreshCcw /> Refresh</button>
            <button className="ar-btn primary" onClick={exportAll}><FiDownload /> Export</button>
          </div>
        </header>

        {/* KPIs */}
        <section className="ar-kpis">
          <div className="ar-kpi">
            <div className="ar-kpi-icon users"><FiUsers /></div>
            <div>
              <div className="ar-kpi-label">Total Users</div>
              <div className="ar-kpi-value">{k(KPI.users)}</div>
              <div className="ar-kpi-delta up">+18.5% this month</div>
            </div>
          </div>
          <div className="ar-kpi">
            <div className="ar-kpi-icon sessions"><FiCalendar /></div>
            <div>
              <div className="ar-kpi-label">Total Sessions</div>
              <div className="ar-kpi-value">{k(KPI.sessions)}</div>
              <div className="ar-kpi-delta up">+8.7% this week</div>
            </div>
          </div>
          <div className="ar-kpi">
            <div className="ar-kpi-icon revenue"><FiDollarSign /></div>
            <div>
              <div className="ar-kpi-label">Revenue</div>
              <div className="ar-kpi-value">${k(KPI.revenue)}</div>
              <div className="ar-kpi-delta up">+22.1% this month</div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="ar-tabs" role="tablist">
          <button className={"ar-tab" + (tab==="sessions" ? " active" : "")} onClick={()=>setTab("sessions")} role="tab">Session Reports</button>
          <button className={"ar-tab" + (tab==="growth" ? " active" : "")} onClick={()=>setTab("growth")} role="tab">User Growth</button>
          <button className={"ar-tab" + (tab==="financial" ? " active" : "")} onClick={()=>setTab("financial")} role="tab">$ Financial</button>
          <button className={"ar-tab" + (tab==="compliance" ? " active" : "")} onClick={()=>setTab("compliance")} role="tab">Compliance</button>
        </div>

        {/* Session Reports */}
        {tab === "sessions" && (
          <section className="ar-section">
            <div className="ar-section-title">
              <div>
                <h2>Daily Session Reports</h2>
                <p>Detailed breakdown of daily session activities and performance metrics</p>
              </div>
            </div>

            <ul className="ar-cards">
              {DAILY.map((d, i) => (
                <li key={i} className="ar-card">
                  <div className="ar-card-head">
                    <div className="ar-day">{d.date}</div>
                    <div className="ar-pill-row">
                      <span className="ar-pill muted">{d.sessions} sessions</span>
                      <span className="ar-pill success">{d.satisfaction.toFixed(1)}/5.0 ★</span>
                    </div>
                  </div>

                  <div className="ar-metrics">
                    <span className="tag success">Completed <b>{d.completed}</b></span>
                    <span className="tag danger">Cancelled <b>{d.cancelled}</b></span>
                    <span className="tag info">Avg Duration <b>{d.avgDuration}</b></span>
                    <span className="tag purple">Revenue <b>${k(d.revenue)}</b></span>
                    <span className="tag sand">Therapists <b>{d.therapists}</b></span>
                    <span className="tag pink">Patients <b>{d.patients}</b></span>
                    <button className="ar-btn ghost"><FiEye /> Details</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* User Growth */}
        {tab === "growth" && (
          <section className="ar-section">
            <div className="ar-section-title">
              <div>
                <h2>User Growth Analytics</h2>
                <p>Monthly user registration and growth trends across all user types</p>
              </div>
            </div>

            <ul className="ar-cards">
              {GROWTH.map((m, i) => (
                <li key={i} className="ar-card">
                  <div className="ar-card-head">
                    <div className="ar-day">{m.month}</div>
                    <div className="ar-pill-row">
                      <span className="ar-pill muted">{k(m.patients + m.therapists)} total users</span>
                      <span className="ar-pill success">{m.totalGrowth} growth</span>
                    </div>
                  </div>

                  <div className="ar-metrics">
                    <span className="tag blue">Patients <b>{k(m.patients)}</b></span>
                    <span className="tag purple">Therapists <b>{k(m.therapists)}</b></span>
                    <span className="tag green">Total Growth <b>{m.totalGrowth}</b></span>
                    <span className="tag sand">Retention Rate <b>{m.retention}</b><small> monthly retention</small></span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Financial */}
        {tab === "financial" && (
          <section className="ar-section">
            <div className="ar-section-title">
              <div>
                <h2>$ Financial Reports</h2>
                <p>Revenue breakdown and financial performance analysis</p>
              </div>
            </div>

            <ul className="ar-cards">
              {FINANCIAL.map((f, i) => (
                <li key={i} className="ar-card">
                  <div className="ar-card-head">
                    <div className="ar-day">{f.month}</div>
                    <div className="ar-pill-row">
                      <span className="ar-pill success">{f.growth} growth</span>
                      <span className="ar-pill muted">{f.tx} transactions</span>
                    </div>
                  </div>

                  <div className="ar-metrics">
                    <span className="tag green">Total Revenue <b>${k(f.total)}</b></span>
                    <span className="tag blue">Subscriptions <b>${k(f.subs)}</b></span>
                    <span className="tag purple">Consultations <b>${k(f.consults)}</b></span>
                    <span className="tag danger">Refunds <b>${k(f.refunds)}</b></span>
                    <span className="tag teal">Net Revenue <b>${k(f.net)}</b></span>
                    <span className="tag sand">Avg Transaction <b>${f.avg.toFixed(2)}</b></span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Compliance */}
        {tab === "compliance" && (
          <section className="ar-section">
            <div className="ar-section-title">
              <div>
                <h2>Compliance & Security Reports</h2>
                <p>Regulatory compliance and security audit status overview</p>
              </div>
            </div>

            <ul className="ar-cards">
              {COMPLIANCE.map((c, i) => (
                <li key={i} className="ar-card">
                  <div className="ar-card-head">
                    <div className="ar-day">{c.title}</div>
                    <div className="ar-pill-row">
                      <span className={"ar-pill " + (c.status.includes("Compliant") ? "success" : "warn")}>{c.status}</span>
                      <span className="ar-pill info">Score: {c.score}</span>
                      {c.issues ? <span className="ar-pill danger">{c.issues} issues</span> : null}
                    </div>
                  </div>

                  <div className="ar-metrics">
                    <span className="tag blue">Last Audit <b>{c.last}</b></span>
                    <span className="tag purple">Next Audit <b>{c.next}</b></span>
                    <span className={"tag " + (c.priority === "low" ? "green" : "warn")}>Priority <b>{c.priority}</b></span>
                    <span className="tag teal">Auditor <b>{c.auditor}</b></span>
                    <button className="ar-btn ghost"><FiEye /> View Report</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
