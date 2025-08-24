import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // ✅ Use real auth context
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="lp-navbar" aria-label="Main Navigation">
      <div
        className="lp-logo-group"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <span className="lp-logo-bg">
          <FaCheckCircle className="lp-logo" />
        </span>
        <span className="lp-title">SwasthaMann</span>
      </div>

      <button
        className="lp-menu-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`lp-nav-right${menuOpen ? " open" : ""}`}>
        {!user ? (
          <>
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                "lp-login" + (isActive ? " active" : "")
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/auth/register"
              className={({ isActive }) =>
                "lp-getstarted" + (isActive ? " active" : "")
              }
            >
              Get Started
            </NavLink>
          </>
        ) : (
          <>
            <span className="lp-username">Hi, {user.name}</span>
            <button className="lp-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
