import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaCheckCircle, FaUserMd, FaCalendarAlt, FaComments, FaHistory,
  FaStar, FaCreditCard, FaUserCircle, FaSignOutAlt, FaHome
} from "react-icons/fa";
import "./Sidebar.css";

const useAuth = () => {
  const user = { name: "John Doe", role: "Patient" };
  return { user, logout: () => { localStorage.removeItem("token"); window.location = "/auth/login"; } };
};

const menu = [
  { label: "Dashboard", icon: <FaHome />, to: "/dashboard/patient" },
  { label: "Find Therapist", icon: <FaUserMd />, to: "/therapists" },
  { label: "Appointments", icon: <FaCalendarAlt />, to: "/appointments/calendar" },
  { label: "Consultation", icon: <FaComments />, to: "/consultation" },
  { label: "History", icon: <FaHistory />, to: "/history" },
  { label: "Feedback", icon: <FaStar />, to: "/feedback" },
  { label: "Payment", icon: <FaCreditCard />, to: "/payment" }
];

export default function Sidebar({ active }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="side-nav" aria-label="Sidebar navigation">
      {/* Logo/Brand */}
      <div className="side-header" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <span className="side-logo-bg">
          <FaCheckCircle className="side-logo" />
        </span>
        <span className="side-appname">SwasthaMann</span>
        <span className="side-portal">Patient Portal</span>
      </div>

      {/* Navigation */}
      <nav className="side-menu">
        {menu.map((item) => (
          <NavLink
            to={item.to}
            key={item.label}
            title={item.label}                // tooltip when collapsed
            className={({ isActive }) =>
              "side-link" + (active === item.label || isActive ? " active" : "")
            }
            end
          >
            <span className="side-icon">{item.icon}</span>
            <span className="side-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile & logout */}
      <div className="side-bottom">
        <div className="side-user">
          <FaUserCircle className="side-user-icon" />
          <div>
            <div className="side-user-name">{user?.name || "Unknown"}</div>
            <div className="side-user-role">{user?.role || ""}</div>
          </div>
        </div>
        <button className="side-logout" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}
