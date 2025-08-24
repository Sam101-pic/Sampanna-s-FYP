// backend/routes/index.js
import { Router } from "express";

// --- Feature Routers ---
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";
import therapistRoutes from "./therapistRoutes.js";
import matchRoutes from "./matchRoutes.js";
import chatRoutes from "./chatRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import videoRoutes from "./videoRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import feedbackRoutes from "./feedbackRoutes.js";

// --- Dev-only Routes ---
import devRoutes from "./devRoutes.js";

/**
 * Mount all API feature routes under /api/*
 */
export default function routes(app) {
  const api = Router();

  /* -------------------- Auth & Users -------------------- */
  api.use("/auth", authRoutes);              // -> /api/auth/*
  api.use("/users", userRoutes);             // -> /api/users/*

  /* -------------------- Admin -------------------- */
  api.use("/admin", adminRoutes);            // -> /api/admin/*

  /* -------------------- Therapists & Matching -------------------- */
  api.use("/therapists", therapistRoutes);   // -> /api/therapists/*
  api.use("/match", matchRoutes);            // -> /api/match/*

  /* -------------------- Chat & Communication -------------------- */
  api.use("/chat", chatRoutes);              // -> /api/chat/*
  api.use("/video", videoRoutes);            // -> /api/video/*

  /* -------------------- Appointments & Payments -------------------- */
  api.use("/appointments", appointmentRoutes); // -> /api/appointments/*
  api.use("/payments", paymentRoutes);         // -> /api/payments/*

  /* -------------------- Feedback -------------------- */
  api.use("/feedback", feedbackRoutes);      // -> /api/feedback/*

  /* -------------------- Dev-only routes -------------------- */
  if (process.env.NODE_ENV !== "production") {
    api.use("/dev", devRoutes);              // -> /api/dev/*
  }

  /* -------------------- Health check endpoint -------------------- */
  api.get("/", (_req, res) => {
    res.json({ message: "🧠 SwasthaMann API root is live" });
  });

  /* -------------------- Catch-all 404 for unknown API routes -------------------- */
  api.use((req, res) => {
    console.warn(`❌ Unknown API route: ${req.originalUrl}`);
    res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
  });

  /* -------------------- Mount everything at /api -------------------- */
  app.use("/api", api);
}
