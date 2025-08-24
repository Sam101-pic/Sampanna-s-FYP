import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, LineChart, Line, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  FaHome, FaUserCog, FaFileAlt, FaCog, FaUserCircle, FaSignOutAlt, FaUserCheck
} from "react-icons/fa";
import "./AdminDashboard.css";

/* --------- mock auth (same pattern as other admin pages) --------- */
function useAuth() {
  const user = { name: "Admin User", role: "Admin" };
  return {
    user,
    logout: () => { localStorage.removeItem("token"); window.location = "/auth/login"; },
  };
}

/* ---------------------- embedded sidebar ------------------------- */
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
            className={({ isActive }) => "side-link" + (isActive || item.label === "Dashboard" ? " active" : "")}
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

/* -------------------------- page -------------------------- */
export default function AdminDashboard() {
  const pieData = [
    { name: "Patients", value: 2156, color: "#3b82f6" },
    { name: "Therapists", value: 456, color: "#10b981" },
    { name: "Admins", value: 23, color: "#a855f7" },
    { name: "Inactive", value: 212, color: "#ef4444" },
  ];
  const barData = [
    { day: "Tue", sessions: 120 },
    { day: "Wed", sessions: 150 },
    { day: "Thu", sessions: 180 },
    { day: "Fri", sessions: 200 },
    { day: "Sat", sessions: 160 },
    { day: "Sun", sessions: 90 },
  ];
  const lineData = [
    { month: "Jan", revenue: 15000 },
    { month: "Feb", revenue: 22000 },
    { month: "Mar", revenue: 30000 },
    { month: "Apr", revenue: 37000 },
    { month: "May", revenue: 45000 },
    { month: "Jun", revenue: 52000 },
  ];

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Platform overview and management center</p>
        </header>

        {/* Top Stats */}
        <section className="admin-cards">
          {[
            { label: "Total Users", value: 2847, color: "#3b82f6" },
            { label: "Active Sessions", value: 156, color: "#10b981" },
            { label: "Revenue", value: 45230, prefix: "$", color: "#8b5cf6" },
            { label: "Pending Issues", value: 7, color: "#ef4444" },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="card"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
            >
              <h3>{card.label}</h3>
              <div className="card-value" style={{ color: card.color }}>
                <CountUp start={0} end={card.value} duration={1.6} separator="," prefix={card.prefix || ""} />
              </div>
            </motion.div>
          ))}
        </section>

        {/* Charts */}
        <section className="admin-charts">
          {/* Pie */}
          <motion.div className="chart-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>User Distribution</h3>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar */}
          <motion.div className="chart-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Session Trends</h3>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData}>
                  <XAxis dataKey="day" />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Line */}
          <motion.div className="chart-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Revenue Growth</h3>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={lineData}>
                  <XAxis dataKey="month" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
