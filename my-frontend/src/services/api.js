// src/services/api.js
import axios from "axios";

// ✅ Make sure your frontend .env has:
// REACT_APP_API_URL=http://localhost:5001/api
// Configure the Axios instance used for API calls.  It defaults to the value
// provided in the environment (.env) but falls back to the simple backend
// running on port 5000 when no value is supplied.  The base URL should
// include the `/api` prefix so that requests like `api.get('/therapists')`
// resolve to `http://localhost:5000/api/therapists`.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// === Request Interceptor ===
// Attach token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Response Interceptor ===
// Handle global errors (like expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("⚠️ Unauthorized or expired session");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        // Optionally: redirect to login
        // window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
