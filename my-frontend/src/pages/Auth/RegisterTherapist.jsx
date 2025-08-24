import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ErrorBox, SuccessBox } from "../../components/ui/MessageBox";
import authService from "../../services/authService";
import heroImg from "../../assets/images/mental-health.png"; // or a therapist-specific image
import "./PatientSignup.css"; // ✅ reuse the same minimal styles

export default function RegisterTherapist() {
  // Load Inter font once
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
    licenseNumber: "",
    specialization: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!fields.name.trim()) e.name = "Full name is required";
    else if (!/^[A-Za-z\s.'-]+$/.test(fields.name))
      e.name = "Use letters, spaces, . ' - only";

    if (!fields.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(fields.email)) e.email = "Invalid email";

    if (!fields.password) e.password = "Password is required";
    else if (fields.password.length < 6) e.password = "At least 6 characters";

    if (!fields.licenseNumber.trim()) e.licenseNumber = "License number is required";
    else if (!/^[A-Za-z0-9-]{3,}$/.test(fields.licenseNumber))
      e.licenseNumber = "Use letters, numbers, or hyphens";

    if (!fields.specialization.trim()) e.specialization = "Specialization is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    const val = validate();
    setErrors(val);
    if (Object.keys(val).length) return;

    setLoading(true);
    try {
      await authService.registerTherapist({
        name: fields.name,
        email: fields.email,
        password: fields.password,
        licenseNumber: fields.licenseNumber,
        specialization: fields.specialization,
      });
      setSuccess("Therapist account created! Redirecting…");
      setTimeout(() => navigate("/dashboard/therapist"), 900);
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

  // tiny password strength
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
        {/* LEFT: compact info panel */}
        <aside className="ps-info">
          <span className="ps-info-badge">THERAPIST</span>
          <div className="ps-info-media">
            <img src={heroImg} alt="Therapist care" />
          </div>
          <h2 className="ps-info-title">Grow your practice with SwasthaMann.</h2>
          <p className="ps-info-text">
            Manage appointments, secure sessions, and reach patients who need your
            expertise — all in a privacy-first platform.
          </p>
        </aside>

        {/* RIGHT: form */}
        <section className="ps-left ps-formcol">
          <div className="ps-left-inner">
            <h1 className="ps-title">Sign up as a therapist</h1>

            {apiError && <ErrorBox>{apiError}</ErrorBox>}
            {success && <SuccessBox>{success}</SuccessBox>}

            <form onSubmit={handleSubmit} className="ps-form">
              <Input
                id="name"
                label="Full Name"
                name="name"
                value={fields.name}
                onChange={handleChange}
                placeholder="Your full name"
                error={errors.name}
                disabled={loading}
                autoComplete="name"
              />

              <Input
                id="email"
                type="email"
                label="Email Address"
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="you@clinic.com"
                error={errors.email}
                disabled={loading}
                autoComplete="email"
              />

              <label className="ps-label" htmlFor="password">Create Password</label>
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
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="ps-toggle"
                  onClick={() =>
                    setFields((p) => ({ ...p, showPassword: !p.showPassword }))
                  }
                  aria-label={fields.showPassword ? "Hide password" : "Show password"}
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
                    {strength <= 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}
                  </span>
                </div>
              )}

              <Input
                id="licenseNumber"
                label="License Number"
                name="licenseNumber"
                value={fields.licenseNumber}
                onChange={handleChange}
                placeholder="e.g., ABC-12345"
                error={errors.licenseNumber}
                disabled={loading}
                autoComplete="off"
              />

              <Input
                id="specialization"
                label="Specialization"
                name="specialization"
                value={fields.specialization}
                onChange={handleChange}
                placeholder="e.g., Anxiety, Family Therapy"
                error={errors.specialization}
                disabled={loading}
                autoComplete="off"
              />

              <Button type="submit" loading={loading} className="ps-cta">
                Sign up
              </Button>
            </form>

            <div className="ps-alt">
              Already have an account? <a href="/auth/login/therapist">Login</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
