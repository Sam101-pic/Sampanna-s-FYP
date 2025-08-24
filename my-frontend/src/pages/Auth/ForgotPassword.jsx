import React, { useState } from "react";
import authService from "../../services/authService";
import { ErrorBox, SuccessBox } from "../../components/ui/MessageBox";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError("Failed to send reset link. Check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      {sent ? (
        <SuccessBox>Check your email for reset instructions.</SuccessBox>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          {error && <ErrorBox>{error}</ErrorBox>}
          <Button loading={loading}>Send Reset Link</Button>
        </form>
      )}
    </div>
  );
}
