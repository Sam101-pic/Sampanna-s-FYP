import React from "react";

const SwasthaMannIcon = ({
  size = 64,
  className = "",
  style = {},
  title = "SwasthaMann Icon"
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
    className={className}
    style={{ display: "block", ...style }}
  >
    <title>{title}</title>
    <defs>
      <linearGradient id="swm-gradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7c3aed"/>
        <stop offset="1" stopColor="#60a5fa"/>
      </linearGradient>
    </defs>
    {/* Heart shape */}
    <path
      d="M40 68c-1.7-1.5-16-14.5-22-20.9C10 41 10 30.2 18 25c6-4 14.4-1.3 17.6 5.1C39.1 32 40.9 32 44.4 30.1 47.6 23.7 56 21 62 25c8 5.2 8 16 0 22.1C56 53.5 41.7 66.5 40 68z"
      fill="url(#swm-gradient)"
      stroke="#fff"
      strokeWidth="3"
      filter="drop-shadow(0 2px 8px rgba(96,165,250,0.25))"
    />
    {/* Chat bubble */}
    <ellipse
      cx="40"
      cy="38"
      rx="13"
      ry="10"
      fill="#fff"
      opacity="0.9"
    />
    {/* 3 dots (conversation) */}
    <circle cx="35" cy="38" r="1.7" fill="#7c3aed"/>
    <circle cx="40" cy="38" r="1.7" fill="#7c3aed"/>
    <circle cx="45" cy="38" r="1.7" fill="#7c3aed"/>
    {/* Shield for privacy */}
    <path
      d="M58 33c0 7-5 11-10.3 12.6-.7.2-1.7.2-2.3 0C40 44 35 40 35 33c0-2 1.6-4 5-4s5 2 5 4z"
      fill="#7c3aed"
      opacity="0.12"
    />
  </svg>
);

export default SwasthaMannIcon;
