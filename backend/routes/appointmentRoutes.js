// backend/routes/appointmentRoutes.js
import express from "express";
import {
  listAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  joinAppointment,
  v,
} from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Appointment Routes
 * All require authentication
 */

// 🔹 Book a new appointment (frontend expects this)
router.post("/book", protect, ...v.create, createAppointment);

// 🔹 Create appointment (generic, optional if you only want /book)
router.post("/", protect, ...v.create, createAppointment);

// 🔹 List appointments
router.get("/", protect, ...v.list, listAppointments);

// 🔹 Get appointment by ID
router.get("/:id", protect, ...v.idOnly, getAppointmentById);

// 🔹 Update appointment (reschedule, add notes, change status)
router.put("/:id", protect, ...v.update, updateAppointment);

// 🔹 Cancel appointment
router.delete("/:id", protect, ...v.idOnly, cancelAppointment);

// 🔹 Join appointment (for video sessions)
router.post("/:id/join", protect, ...v.idOnly, joinAppointment);

export default router;
