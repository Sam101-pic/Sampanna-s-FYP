import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { ErrorBox } from "../../components/ui/MessageBox";
import "./LoginPatient.css"; // ✅ reuse same CSS for Therapist

export default function LoginTherapist() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
      const res = await authService.loginTherapist(fields.email, fields.password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        login({
          name: res.name,
          email: res.email,
          role: res.role || "therapist",
        });
        navigate("/dashboard/therapist");
      } else {
        throw new Error("Token not received");
      }
    } catch (err) {
      setApiError(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setApiError("");
    try {
      const res = await authService.googleLogin(credentialResponse.credential);
      if (res.token) {
        localStorage.setItem("token", res.token);
        login({
          name: res.name,
          email: res.email,
          role: res.role || "therapist",
        });
        navigate("/dashboard/therapist");
      } else {
        throw new Error("Token not received from Google login");
      }
    } catch (err) {
      setApiError("Google login failed. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="role-badge therapist">Therapist</div>
        <h2 className="login-title">Welcome back</h2>
        <p className="login-subtitle">Log in to continue your sessions</p>

        {apiError && <ErrorBox>{apiError}</ErrorBox>}

        <form onSubmit={handleSubmit} autoComplete="on" className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
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

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setApiError("Google login failed.")}
            useOneTap
            theme="outline"
            size="large"
            shape="pill"
            text="signin_with"
          />
          {googleLoading && <div className="google-loading">Signing in...</div>}
        </div>

        <div className="auth-links">
          <a href="/auth/forgot-password">Forgot Password?</a>
          <a href="/auth/register/therapist">Don’t have an account? Sign Up</a>
        </div>
      </div>
    </div>
  );
}
