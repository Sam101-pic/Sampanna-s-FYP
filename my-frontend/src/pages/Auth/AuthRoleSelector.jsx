import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaUser, FaUserMd, FaUserShield } from "react-icons/fa";
import heroImg from "../../assets/images/mental-health.png"; // ✅ Update your path accordingly
import "./AuthRoleSelector.css";

export default function AuthRoleSelector({ mode = "login" }) {
  const navigate = useNavigate();
  const isLogin = mode === "login";

  return (
    <div className="sw-authrole-bg">
      <div className="sw-authrole-card">
        {/* Left visual panel */}
        <div className="sw-authrole-side">
          <div className="sw-authrole-logo-row">
            <span className="sw-authrole-logo-bg">
              <FaCheckCircle className="sw-authrole-logo" />
            </span>
            <span className="sw-authrole-logo-text">SwasthaMann</span>
          </div>
          <div className="sw-authrole-side-img-wrapper">
            <img src={heroImg} alt="Mental Health" className="sw-authrole-side-img" />
          </div>
          <div className="sw-authrole-tagline">
            <div>
              Secure telemedicine for <span>everyone</span>.
            </div>
            <div className="sw-authrole-tagline-sm">
              Join as a patient, therapist, or admin and start your journey.
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="sw-authrole-action-side">
          <div className="sw-authrole-inner">
            <h2>{isLogin ? "Log in as" : "Sign up as"}</h2>
            <div className="sw-authrole-buttons">
              <button
                className="sw-authrole-btn"
                onClick={() =>
                  navigate(
                    isLogin ? "/auth/login/patient" : "/auth/register/patient"
                  )
                }
              >
                <FaUser className="sw-authrole-btn-icon" />
                Patient
              </button>

              <button
                className="sw-authrole-btn"
                onClick={() =>
                  navigate(
                    isLogin
                      ? "/auth/login/therapist"
                      : "/auth/register/therapist"
                  )
                }
              >
                <FaUserMd className="sw-authrole-btn-icon" />
                Therapist
              </button>

              <button
                className="sw-authrole-btn"
                onClick={() =>
                  navigate(
                    isLogin ? "/auth/login/admin" : "/auth/register/admin"
                  )
                }
              >
                <FaUserShield className="sw-authrole-btn-icon" />
                Admin
              </button>
            </div>

            <div className="sw-authrole-alt">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <span
                    className="sw-authrole-link"
                    onClick={() => navigate("/auth/register")}
                  >
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="sw-authrole-link"
                    onClick={() => navigate("/auth/login")}
                  >
                    Log in
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
