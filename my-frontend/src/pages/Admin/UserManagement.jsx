import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome, FaUserCog, FaFileAlt, FaCog, FaUserCircle, FaSignOutAlt, FaUserCheck
} from "react-icons/fa";
import {
  FiSearch, FiMoreVertical, FiCheck, FiX, FiShield, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import "./UserManagement.css";

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
              "side-link" + (isActive || item.label === "User Management" ? " active" : "")
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
const USERS = [
  { id: 1, name: "Dr. Sarah Johnson", email: "sarah.johnson@email.com", role: "Therapist", status: "active",    joined: "2024-01-15", lastActive: "2 hours ago", sessions: 45 },
  { id: 2, name: "John Doe",          email: "john.doe@email.com",      role: "Patient",   status: "active",    joined: "2024-01-10", lastActive: "1 day ago",  sessions: 0  },
  { id: 3, name: "Dr. Michael Chen",  email: "michael.chen@email.com",  role: "Therapist", status: "pending",   joined: "2024-01-14", lastActive: "Never",       sessions: 0  },
  { id: 4, name: "Sarah Miller",      email: "sarah.miller@email.com",  role: "Patient",   status: "suspended", joined: "2023-12-20", lastActive: "1 week ago",  sessions: 0  },
];

const REPORTS = [
  { id: 101, title: "Session Quality",       priority: "medium", status: "open",           reporter: "John Doe",  reported: "Dr. Sarah Johnson", date: "2024-01-15", description: "Patient reported concerns about session effectiveness" },
  { id: 102, title: "Professional Conduct",  priority: "high",   status: "investigating",  reporter: "Anonymous", reported: "Dr. Michael Chen",   date: "2024-01-14", description: "Inappropriate behavior during video session" },
];

export default function UserManagement() {
  const [tab, setTab] = useState("accounts"); // 'accounts' | 'reports'
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [users, setUsers] = useState(USERS);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter)   list = list.filter(u => u.role === roleFilter);
    if (statusFilter) list = list.filter(u => u.status === statusFilter);
    return list;
  }, [users, query, roleFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pageData  = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const setStatus = (id, status) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));

  return (
    <div className="um-shell">
      <AdminSidebar />

      <main className="um-main">
        {/* header */}
        <header className="um-header">
          <div>
            <h1>User Management</h1>
            <p>Manage users, verify accounts, and handle disputes</p>
          </div>
          <button className="um-theme" aria-label="Toggle theme">◐</button>
        </header>

        {/* tabs */}
        <div className="um-tabs" role="tablist">
          <button className={"um-tab" + (tab === "accounts" ? " active" : "")} onClick={() => setTab("accounts")} role="tab" aria-selected={tab === "accounts"}>User Accounts</button>
          <button className={"um-tab" + (tab === "reports" ? " active" : "")}  onClick={() => setTab("reports")}  role="tab" aria-selected={tab === "reports"}>Disputes & Reports</button>
        </div>

        {/* Accounts */}
        {tab === "accounts" && (
          <>
            <section className="um-filter">
              <div className="um-filter-title">Filter Users</div>
              <div className="um-filter-row">
                <div className="um-search">
                  <FiSearch />
                  <input
                    placeholder="Search by name or email"
                    value={query}
                    onChange={(e) => { setPage(1); setQuery(e.target.value); }}
                  />
                </div>
                <select className="um-select" value={roleFilter} onChange={(e) => { setPage(1); setRoleFilter(e.target.value); }}>
                  <option value="">All Roles</option>
                  <option value="Therapist">Therapist</option>
                  <option value="Patient">Patient</option>
                  <option value="Admin">Admin</option>
                </select>
                <select className="um-select" value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}>
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </section>

            <section className="um-list">
              <div className="um-list-head">
                <h2>User Accounts ({filteredUsers.length})</h2>
                <span className="um-subtle">Manage platform users and their account status</span>
              </div>

              <ul className="um-items">
                {pageData.map(u => (
                  <li key={u.id} className="um-item">
                    <div className="um-left">
                      <div className="um-avatar">{u.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
                      <div className="um-meta">
                        <div className="um-name">{u.name}</div>
                        <div className="um-email">{u.email}</div>
                        <div className="um-sub">
                          <span>Joined: {new Date(u.joined).toLocaleDateString()}</span>
                          <span className="um-dot">•</span>
                          <span>Last active: {u.lastActive}</span>
                          <span className="um-dot">•</span>
                          <span>{u.sessions} sessions</span>
                        </div>
                      </div>
                    </div>

                    <div className="um-right">
                      <span className="um-chip role">{u.role}</span>
                      <span className={"um-chip status " + u.status}>{u.status}</span>

                      {u.status === "pending" && (
                        <div className="um-verify">
                          <button className="um-icon ok"   title="Verify"   onClick={() => setStatus(u.id, "active")}><FiCheck /></button>
                          <button className="um-icon warn" title="Suspend"  onClick={() => setStatus(u.id, "suspended")}><FiShield /></button>
                          <button className="um-icon danger" title="Reject" onClick={() => setStatus(u.id, "suspended")}><FiX /></button>
                        </div>
                      )}

                      <button className="um-kebab" title="More actions"><FiMoreVertical /></button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="um-pager">
                <button className="um-small" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                  <FiChevronLeft /> Previous
                </button>
                <div className="um-pagecount">Page {page} of {pageCount}</div>
                <button className="um-small" disabled={page >= pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>
                  Next <FiChevronRight />
                </button>
              </div>
            </section>
          </>
        )}

        {/* Reports */}
        {tab === "reports" && (
          <section className="um-reports">
            <div className="um-section-title">Disputes & Reports</div>
            <p className="um-subtle">Handle user disputes and incident reports</p>

            <ul className="um-ritems">
              {REPORTS.map(r => (
                <li key={r.id} className="um-ritem">
                  <div className="um-rhead">
                    <div className="um-rtitle">
                      <span className="um-rmain">{r.title}</span>
                      <span className={"um-chip prio " + r.priority}>{r.priority} priority</span>
                    </div>
                    <span className={"um-rstatus " + r.status}>{r.status}</span>
                  </div>

                  <div className="um-rmeta">
                    <span>Reporter: <b>{r.reporter}</b></span>
                    <span className="um-dot">|</span>
                    <span>Reported: <b>{r.reported}</b></span>
                    <span className="um-dot">|</span>
                    <span>Date: {new Date(r.date).toLocaleDateString()}</span>
                  </div>

                  <div className="um-rdesc">
                    <div className="um-label">Description</div>
                    <p>{r.description}</p>
                  </div>

                  <div className="um-ractions">
                    <button className="um-btn">View Details</button>
                    <button className="um-btn">Investigate</button>
                    <button className="um-btn">Resolve</button>
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
