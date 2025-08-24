// src/pages/auth/RegisterPatient.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ErrorBox, SuccessBox } from "../../components/ui/MessageBox";
import authService from "../../services/authService";
import heroImg from "../../assets/images/mental-health.png";
import "./PatientSignup.css";

export default function RegisterPatient() {
  useEffect(() => {
    const id = "inter-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    showPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!fields.name.trim()) errs.name = "Name is required";
    else if (!/^[A-Za-z\s.'-]+$/.test(fields.name))
      errs.name = "Use letters, spaces, . ' - only";

    if (!fields.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) errs.email = "Invalid email";

    if (!fields.password) errs.password = "Password is required";
    else if (fields.password.length < 6) errs.password = "At least 6 characters";
    return errs;
  };

  const handleChange = (e) =>
    setFields((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");
    const valErrs = validate();
    setErrors(valErrs);
    if (Object.keys(valErrs).length) return;

    setLoading(true);
    try {
      const res = await authService.registerPatient(
        fields.name,
        fields.email,
        fields.password
      );
      if (res?.token) localStorage.setItem("token", res.token);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/dashboard/patient"), 900);
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = useMemo(() => {
    const v = fields.password || "";
    let s = 0;
    if (v.length >= 6) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return Math.min(s, 4);
  }, [fields.password]);

  return (
    <div className="ps-shell">
      <div className="ps-card ps-card--minimal">
        {/* LEFT: compact info panel (new) */}
        <aside className="ps-info">
          <span className="ps-info-badge">SwasthaMann</span>
          <div className="ps-info-media">
            <img src={heroImg} alt="Mental health care" />
          </div>
          <h2 className="ps-info-title">Secure care for everyone.</h2>
          <p className="ps-info-text">
            Join as a patient and start your journey with trusted therapists,
            encrypted sessions, and smart scheduling.
          </p>
        </aside>

        {/* RIGHT: clean form */}
        <section className="ps-left ps-formcol">
          <div className="ps-left-inner">
            <h1 className="ps-title">Create your account</h1>

            {apiError && <ErrorBox>{apiError}</ErrorBox>}
            {success && <SuccessBox>{success}</SuccessBox>}

            <form onSubmit={handleSubmit} className="ps-form">
              <Input
                label="Full Name"
                name="name"
                value={fields.name}
                onChange={handleChange}
                placeholder="Your full name"
                error={errors.name}
                disabled={loading}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
                disabled={loading}
              />

              <label className="ps-label" htmlFor="password">
                Create Password
              </label>
              <div className="ps-pass-row">
                <input
                  id="password"
                  name="password"
                  type={fields.showPassword ? "text" : "password"}
                  value={fields.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className={`ps-input ${errors.password ? "has-error" : ""}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="ps-toggle"
                  onClick={() =>
                    setFields((p) => ({ ...p, showPassword: !p.showPassword }))
                  }
                  aria-label={
                    fields.showPassword ? "Hide password" : "Show password"
                  }
                >
                  {fields.showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password ? (
                <div className="input-error">{errors.password}</div>
              ) : (
                <div className="ps-strength">
                  <span className={`dot ${strength >= 1 ? "on" : ""}`} />
                  <span className={`dot ${strength >= 2 ? "on" : ""}`} />
                  <span className={`dot ${strength >= 3 ? "on" : ""}`} />
                  <span className={`dot ${strength >= 4 ? "on" : ""}`} />
                  <span className="ps-strength-text">
                    {strength <= 1
                      ? "Weak"
                      : strength === 2
                      ? "Fair"
                      : strength === 3
                      ? "Good"
                      : "Strong"}
                  </span>
                </div>
              )}

              <Button type="submit" loading={loading} className="ps-cta">
                Create account
              </Button>
            </form>

            <div className="ps-alt">
              Already have an account? <a href="/auth/login/patient">Log in</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
