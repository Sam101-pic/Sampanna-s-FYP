import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Replace with your real auth context/hook!
const useAuth = () => {
  // Example: return { user: { name: "Sam" }, token: "..." };
  const token = localStorage.getItem("token");
  return { user: token ? { name: "User" } : null, token };
};

const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
