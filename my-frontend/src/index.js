// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";

// Use a .env value so you don't hardcode secrets in source
// CRA expects the REACT_APP_ prefix
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID && process.env.NODE_ENV === "development") {
  // Helpful warning during local dev; safe to keep
  // eslint-disable-next-line no-console
  console.warn(
    "Missing REACT_APP_GOOGLE_CLIENT_ID in your frontend .env file. Google Sign-In will fail."
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Optional: performance reporting
reportWebVitals();
