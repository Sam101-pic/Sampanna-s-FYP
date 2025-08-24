import React from "react";
import { Link } from "react-router-dom";
import { FaVideo, FaCommentDots, FaRobot, FaStar, FaCheckCircle, FaUserMd, FaHeadset } from "react-icons/fa";
import "./LandingPage.css";

// Card content
const features = [
  {
    icon: <FaVideo className="feature-icon blue" />,
    title: "Video Consultations",
    desc: "Secure, high-quality video sessions with licensed therapists from the comfort of your home.",
  },
  {
    icon: <FaCommentDots className="feature-icon green" />,
    title: "Secure Messaging",
    desc: "Encrypted messaging for ongoing support and communication between sessions.",
  },
  {
    icon: <FaRobot className="feature-icon purple" />,
    title: "AI-Powered Matching",
    desc: "Advanced algorithms match you with therapists based on your specific needs and preferences.",
  },
];

// Tilt effect for cards
function TiltCard({ children }) {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(700px) rotateY(${x / 20}deg) rotateX(${-y / 20}deg) scale(1.04)`;
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)";
  };
  return (
    <div
      className="tilt-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      aria-label="Feature"
      role="region"
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="lp-root">
      {/* Hero Section */}
      <section className="lp-hero" aria-labelledby="hero-title">
        <div className="lp-badge" aria-label="User trust badge">
          🌟 Trusted by 10,000+ users worldwide
        </div>
        <h1 className="lp-headline" id="hero-title">
          Your Mental Health, <span className="lp-gradient-text">Our Priority</span>
        </h1>
        <p className="lp-subtext">
          Connect with qualified therapists through secure video consultations, messaging, and AI-powered matching. Take the first step towards better mental health.
        </p>
        <div className="lp-hero-buttons">
          <Link to="/therapists" className="lp-main-btn" aria-label="Find a Therapist">
            Find a Therapist
          </Link>
          <Link to="/auth/register?role=therapist" className="lp-secondary-btn" aria-label="Join as Therapist">
            Join as Therapist
          </Link>
        </div>
        <div className="lp-features">
          <h2 className="lp-section-title" id="features-title">Why Choose SwasthaMann?</h2>
          <div className="lp-feature-grid" aria-labelledby="features-title">
            {features.map((f, i) => (
              <TiltCard key={i}>
                <div className="lp-feature-card">
                  {f.icon}
                  <div className="lp-feature-title">{f.title}</div>
                  <div className="lp-feature-desc">{f.desc}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy, Trust, and Rating */}
      <section className="lp-privacy" aria-labelledby="privacy-title">
        <div className="lp-privacy-list">
          <div className="lp-privacy-item">
            <FaCheckCircle className="lp-privacy-icon green" />
            <span>HIPAA Compliant</span>
            <div className="lp-privacy-desc">End-to-end encryption and secure data handling</div>
          </div>
          <div className="lp-privacy-item">
            <FaUserMd className="lp-privacy-icon green" />
            <span>Licensed Professionals</span>
            <div className="lp-privacy-desc">All therapists are verified and licensed</div>
          </div>
          <div className="lp-privacy-item">
            <FaHeadset className="lp-privacy-icon green" />
            <span>24/7 Support</span>
            <div className="lp-privacy-desc">Round-the-clock technical and crisis support</div>
          </div>
        </div>
        <div className="lp-rating-card">
          <FaStar className="lp-rating-star" />
          <div className="lp-rating-score">4.9/5 Rating</div>
          <div className="lp-rating-subtext">Based on 10,000+ user reviews</div>
          <div className="lp-rating-stars">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="lp-rating-star-sm" />
            ))}
          </div>
          <div className="lp-rating-mini">Trusted by thousands</div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta" aria-labelledby="cta-title">
        <h2 className="lp-cta-title" id="cta-title">Ready to Start Your Mental Health Journey?</h2>
        <p className="lp-cta-text">
          Join thousands who have found support and healing through SwasthaMann
        </p>
        <Link to="/auth/register" className="lp-cta-btn" aria-label="Get Started Today">
          Get Started Today
        </Link>
      </section>
    </div>
  );
}
