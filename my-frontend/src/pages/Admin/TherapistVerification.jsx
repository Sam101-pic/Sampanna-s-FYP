import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome, FaUserCog, FaFileAlt, FaCog, FaUserCircle, FaSignOutAlt, FaUserCheck
} from "react-icons/fa";
import { FiSearch, FiMoreVertical, FiCheck, FiX, FiShield, FiChevronLeft, FiChevronRight, FiFileText, FiEye } from "react-icons/fi";
import "./TherapistVerification.css";

/* mock auth */
function useAuth() {
  const user = { name: "Admin User", role: "Admin" };
  return {
    user,
    logout: () => { localStorage.removeItem("token"); window.location = "/auth/login"; },
  };
}

/* embedded sidebar (same format as other admin pages) */
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
              "side-link" + (isActive || item.label === "Therapist Verification" ? " active" : "")
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
        <button className="side-logout" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}

/* mock data */
const THERAPISTS = [
  { id: "t_101", name: "Dr. Sarah Johnson",  email: "sarah.j@email.com",
    submittedAt: "2025-08-15T09:30:00Z",
    license: { number: "PSY-CA-12345", state: "CA", board: "California BBS", expiresOn: "2026-04-01" },
    docs: ["ID", "License", "Insurance", "CV"], status: "pending" },
  { id: "t_102", name: "Dr. Michael Chen",   email: "michael.c@email.com",
    submittedAt: "2025-08-14T11:05:00Z",
    license: { number: "PSY-NY-77421", state: "NY", board: "New York OP",   expiresOn: "2025-11-15" },
    docs: ["ID", "License", "Insurance"], status: "pending" },
  { id: "t_103", name: "Dr. Emily Kim",      email: "emily.k@email.com",
    submittedAt: "2025-08-10T16:20:00Z",
    license: { number: "PSY-TX-50980", state: "TX", board: "Texas BHEC",    expiresOn: "2027-02-09" },
    docs: ["ID", "License", "Insurance", "Cert"], status: "suspended" },
];

/* small helpers */
const fmt = (iso) => new Date(iso).toLocaleString();
const Chip = ({ className="", children }) => <span className={`tv-chip ${className}`}>{children}</span>;
const StatusChip = ({ status }) => (
  <Chip className={
    status === "pending"   ? "pending" :
    status === "approved"  ? "approved" :
    status === "suspended" ? "suspended" : "rejected"
  }>
    {status}
  </Chip>
);

export default function TherapistVerification() {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [expandedId, setExpandedId] = useState(null);
  const [list, setList] = useState(THERAPISTS);

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    let data = [...list];
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.license.number.toLowerCase().includes(q)
      );
    }
    if (stateFilter)  data = data.filter(t => t.license.state === stateFilter);
    if (statusFilter) data = data.filter(t => t.status === statusFilter);
    return data;
  }, [list, query, stateFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const setStatus = (id, status) => setList(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="tv-shell">
      <AdminSidebar />

      <main className="tv-main">
        {/* header */}
        <header className="tv-header">
          <div>
            <h1>Therapist Verification</h1>
            <p>Review credentials and approve therapists for the platform</p>
          </div>
          <button className="tv-theme" aria-label="Toggle theme">◐</button>
        </header>

        {/* filter */}
        <section className="tv-filter">
          <div className="tv-filter-title">Filter Queue</div>
          <div className="tv-filter-row">
            <div className="tv-search">
              <FiSearch />
              <input
                placeholder="Search by name, email, or license #"
                value={query}
                onChange={(e)=>{ setPage(1); setQuery(e.target.value); }}
              />
            </div>

            <select className="tv-select" value={stateFilter} onChange={(e)=>{ setPage(1); setStateFilter(e.target.value); }}>
              <option value="">All States</option>
              <option value="CA">CA</option>
              <option value="NY">NY</option>
              <option value="TX">TX</option>
            </select>

            <select className="tv-select" value={statusFilter} onChange={(e)=>{ setPage(1); setStatusFilter(e.target.value); }}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </section>

        {/* list */}
        <section className="tv-list">
          <div className="tv-list-head">
            <h2>Queue ({filtered.length})</h2>
            <span className="tv-subtle">Only admins/compliance can approve</span>
          </div>

          <ul className="tv-items">
            {pageData.map(t => {
              const expanded = expandedId === t.id;
              return (
                <li key={t.id} className="tv-item">
                  <div className="tv-left">
                    <div className="tv-avatar">{t.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
                    <div className="tv-meta">
                      <div className="tv-name">{t.name}</div>
                      <div className="tv-email">{t.email}</div>
                      <div className="tv-sub">
                        <span>Submitted: {fmt(t.submittedAt)}</span>
                        <span className="tv-dot">•</span>
                        <span>Board: {t.license.board}</span>
                        <span className="tv-dot">•</span>
                        <span>Expires: {new Date(t.license.expiresOn).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="tv-mid">
                    <div className="tv-row">
                      <Chip className="role">Therapist</Chip>
                      <StatusChip status={t.status} />
                    </div>
                    <div className="tv-row wrap">
                      <Chip className="lic">#{t.license.number}</Chip>
                      <Chip className="state">{t.license.state}</Chip>
                      {t.docs.map((d,i)=>(
                        <Chip key={i} className="doc"><FiFileText /> {d}</Chip>
                      ))}
                    </div>
                  </div>

                  <div className="tv-right-actions">
                    {t.status === "pending" ? (
                      <div className="tv-verify">
                        <button className="tv-icon ok"    title="Approve"  onClick={()=>setStatus(t.id,"approved")}><FiCheck /></button>
                        <button className="tv-icon warn"  title="Suspend"  onClick={()=>setStatus(t.id,"suspended")}><FiShield /></button>
                        <button className="tv-icon danger" title="Reject"  onClick={()=>setStatus(t.id,"rejected")}><FiX /></button>
                      </div>
                    ) : (
                      <div className="tv-verify">
                        <button className="tv-icon ok"    title="Re-approve" onClick={()=>setStatus(t.id,"approved")}><FiCheck /></button>
                        <button className="tv-icon danger" title="Reject"     onClick={()=>setStatus(t.id,"rejected")}><FiX /></button>
                      </div>
                    )}
                    <button className="tv-kebab" title="Details" onClick={()=>toggleExpand(t.id)}>
                      <FiMoreVertical />
                    </button>
                  </div>

                  {expanded && (
                    <div className="tv-expand">
                      <div className="tv-expand-grid">
                        <div>
                          <div className="tv-label">License</div>
                          <div className="tv-kv"><b>Number:</b> {t.license.number}</div>
                          <div className="tv-kv"><b>State:</b> {t.license.state}</div>
                          <div className="tv-kv"><b>Board:</b> {t.license.board}</div>
                          <div className="tv-kv"><b>Expires:</b> {new Date(t.license.expiresOn).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="tv-label">Documents</div>
                          <div className="tv-docs">
                            {t.docs.map((d,i)=> <Chip key={i} className="doc big"><FiFileText /> {d}</Chip>)}
                          </div>
                        </div>
                        <div>
                          <div className="tv-label">Actions</div>
                          <div className="tv-actions-row">
                            <button className="tv-btn">Open Profile</button>
                            <button className="tv-btn"><FiEye /> Preview Docs</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* pager */}
          <div className="tv-pager">
            <button className="tv-small" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
              <FiChevronLeft /> Previous
            </button>
            <div className="tv-pagecount">Page {page} of {pageCount}</div>
            <button className="tv-small" disabled={page >= pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>
              Next <FiChevronRight />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
