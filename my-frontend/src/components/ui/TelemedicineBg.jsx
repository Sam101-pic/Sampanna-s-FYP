// src/components/ui/TelemedicineBg.jsx
import React from "react";

// Use "position: fixed" to cover all, or "absolute" inside main container.
const TelemedicineBg = () => (
  <svg
    className="tele-bg"
    width="100vw"
    height="100vh"
    viewBox="0 0 1440 900"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "fixed",
      top: 0, left: 0, zIndex: 0,
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
    }}
    aria-hidden="true"
  >
    {/* Soft main gradient blob */}
    <ellipse
      cx="1120"
      cy="200"
      rx="400"
      ry="260"
      fill="url(#med-gradient1)"
      opacity="0.13"
    />
    {/* Smaller bottom blob */}
    <ellipse
      cx="200"
      cy="820"
      rx="340"
      ry="150"
      fill="url(#med-gradient2)"
      opacity="0.15"
    />
    {/* Icon - heart in chat */}
    <g opacity="0.09">
      <rect x="940" y="510" rx="38" width="160" height="120" fill="#60a5fa" />
      <path
        d="M1020 585c-2-2-14-12-19-19-7-8-7-18 2-23 6-4 13-2 17 4 4-6 11-8 17-4 9 5 9 15 2 23-5 7-17 17-19 19z"
        fill="#fff"
      />
    </g>
    {/* Icon - stethoscope */}
    <g opacity="0.09">
      <circle cx="340" cy="340" r="64" fill="#a78bfa" />
      <path d="M325 320c0 16 9 23 24 27v15c0 12 8 22 19 22s19-10 19-22v-15c15-4 24-11 24-27" stroke="#fff" strokeWidth="6" fill="none"/>
    </g>
    {/* Wavy path */}
    <path d="M0 600 Q400 720 1440 480" stroke="#a78bfa" strokeWidth="24" opacity="0.05" fill="none"/>
    <defs>
      <linearGradient id="med-gradient1" x1="800" y1="0" x2="1440" y2="420" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa"/>
        <stop offset="1" stopColor="#60a5fa"/>
      </linearGradient>
      <linearGradient id="med-gradient2" x1="0" y1="800" x2="500" y2="900" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60a5fa"/>
        <stop offset="1" stopColor="#a78bfa"/>
      </linearGradient>
    </defs>
  </svg>
);

export default TelemedicineBg;
