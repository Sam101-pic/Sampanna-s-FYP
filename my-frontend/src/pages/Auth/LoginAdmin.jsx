import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { ErrorBox } from "../../components/ui/MessageBox";
import "./LoginPatient.css";

export default function LoginAdmin() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const errs = {};
    if (!fields.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) errs.email = "Invalid email";
    if (!fields.password) errs.password = "Password is required";
    else if (fields.password.length < 6) errs.password = "At least 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const valErrs = validate();
    setErrors(valErrs);
    if (Object.keys(valErrs).length) return;

    setLoading(true);
    try {
      const res = await authService.loginAdmin(fields.email, fields.password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        login({
          name: res.name || "Admin",
          email: res.email,
          role: "admin",
        });
        navigate("/dashboard/admin");
      } else {
        throw new Error("Token not received");
      }
    } catch (err) {
      setApiError(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card admin">
        <div className="login-app-logo">SwasthaMann</div>
        <div className="role-badge admin">Admin</div>
        <h2 className="login-title">Admin Login</h2>

        {apiError && <ErrorBox>{apiError}</ErrorBox>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={fields.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && <div className="input-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={fields.showPassword ? "text" : "password"}
                value={fields.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
              />
              <span
                className="toggle-eye"
                onClick={() =>
                  setFields((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
              >
                {fields.showPassword ? "🙈" : "👁"}
              </span>
            </div>
            {errors.password && (
              <div className="input-error">{errors.password}</div>
            )}
          </div>

          <button type="submit" className="auth-btn admin" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
