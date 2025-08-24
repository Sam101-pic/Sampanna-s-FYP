import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

const Footer = () => (
  <footer className="footer" aria-label="Site Footer">
    <div className="footer-content">
      <div className="footer-brand">
        <div className="footer-logo-group">
          <FaCheckCircle className="footer-heart" />
          <span className="footer-title">SwasthaMann</span>
        </div>
        <div className="footer-address">
          123 Wellness Ave<br />
          Kathmandu, Nepal<br />
          <span className="footer-email">hello@swasthamann.com</span>
        </div>
      </div>
      <div className="footer-columns">
        <div>
          <div className="footer-heading">Discover</div>
          <Link to="/therapists">Find Therapist</Link>
          <Link to="/about">How it Works</Link>
          <Link to="/payment/plans">Pricing</Link>
        </div>
        <div>
          <div className="footer-heading">About</div>
          <Link to="/team">Team</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/blog">Blog</Link>
        </div>
        <div>
          <div className="footer-heading">Support</div>
          <Link to="/help">Help Center</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
        </div>
        <div>
          <div className="footer-heading">Social</div>
          <div className="footer-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </div>
    <div className="footer-copyright">
      © 2025 SwasthaMann. All rights reserved.
    </div>
  </footer>
);

export default Footer;
