import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import Button from "../../components/ui/Button";
import { ErrorBox, SuccessBox } from "../../components/ui/MessageBox";
import Input from "../../components/ui/Input";
import "./Auth.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract reset token from query param
  const token = new URLSearchParams(location.search).get("token");

  // Client-side validation (optional)
  const validate = () => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setReset(true);
      setTimeout(() => navigate("/auth/login"), 1800);
    } catch (err) {
      console.error("❌ Reset failed:", err.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
        "Failed to reset password. The link may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Reset Password</h2>

      {reset ? (
        <SuccessBox>Password reset! Redirecting to login...</SuccessBox>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            autoComplete="new-password"
            required
          />
          {error && <ErrorBox>{error}</ErrorBox>}
          <Button type="submit" loading={loading}>
            Reset Password
          </Button>
        </form>
      )}
    </div>
  );
}
