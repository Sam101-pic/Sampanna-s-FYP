// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import { validationResult, body, param, query } from "express-validator";

// ---------- helpers ----------
const canAccess = (user, appt) =>
  user?.role === "admin" ||
  String(appt.patientId) === String(user._id) ||
  String(appt.therapistId) === String(user._id);

const toPlain = (doc) => ({
  id: doc._id,
  patientId: doc.patientId,
  therapistId: doc.therapistId,
  datetime: doc.datetime,
  durationMin: doc.durationMin,
  type: doc.type,
  status: doc.status,
  meetingUrl: doc.meetingUrl,
  notes: doc.notes,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// ---------- validators ----------
export const v = {
  list: [query("scope").optional().isIn(["upcoming", "history"])],
  create: [
    body("therapistId").isMongoId(),
    body("datetime").isISO8601(),
    body("durationMin").optional().isInt({ min: 15, max: 180 }),
    body("type").optional().isIn(["video", "text"]),
  ],
  update: [
    param("id").isMongoId(),
    body("datetime").optional().isISO8601(),
    body("durationMin").optional().isInt({ min: 15, max: 180 }),
    body("type").optional().isIn(["video", "text"]),
    body("status").optional().isIn(["scheduled", "completed", "cancelled"]),
    body("notes").optional().isString().isLength({ max: 2000 }),
  ],
  idOnly: [param("id").isMongoId()],
};

// ---------- controllers ----------
export async function createAppointment(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { therapistId, datetime, durationMin, type } = req.body;

    const appt = await Appointment.create({
      patientId: req.user._id,
      therapistId,
      datetime: new Date(datetime),
      durationMin: durationMin || 50,
      type: type || "video",
      status: "scheduled",
    });

    res.status(201).json(toPlain(appt));
  } catch (e) {
    console.error("CreateAppointment Error:", e.message);
    res.status(500).json({ message: "Failed to create appointment" });
  }
}

export async function listAppointments(req, res) {
  try {
    const scope = (req.query.scope || "upcoming").toLowerCase();
    const now = new Date();

    // patient sees own; therapist sees theirs; admin sees all
    let filter = {};
    if (req.user.role === "therapist") filter.therapistId = req.user._id;
    else if (req.user.role === "admin") filter = {};
    else filter.patientId = req.user._id;

    if (scope === "upcoming") {
      Object.assign(filter, {
        datetime: { $gte: now },
        status: { $in: ["scheduled"] },
      });
    } else if (scope === "history") {
      Object.assign(filter, {
        $or: [
          { datetime: { $lt: now } },
          { status: { $in: ["completed", "cancelled"] } },
        ],
      });
    }

    const items = await Appointment.find(filter)
      .sort({ datetime: 1 })
      .populate("patientId", "name role")
      .populate("therapistId", "name role")
      .lean();

    res.json({ items: items.map((x) => ({ ...x, id: x._id })) });
  } catch (e) {
    console.error("ListAppointments Error:", e.message);
    res.status(500).json({ message: "Failed to list appointments" });
  }
}

export async function getAppointmentById(req, res) {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (!canAccess(req.user, appt))
      return res.status(403).json({ message: "Forbidden" });

    res.json(toPlain(appt));
  } catch (e) {
    console.error("GetAppointmentById Error:", e.message);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
}

export async function updateAppointment(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (!canAccess(req.user, appt))
      return res.status(403).json({ message: "Forbidden" });

    const { datetime, durationMin, status, type, notes } = req.body;
    if (datetime) appt.datetime = new Date(datetime);
    if (durationMin !== undefined) appt.durationMin = durationMin;
    if (type) appt.type = type;
    if (notes !== undefined) appt.notes = notes;
    if (status && ["scheduled", "completed", "cancelled"].includes(status))
      appt.status = status;

    await appt.save();
    res.json(toPlain(appt));
  } catch (e) {
    console.error("UpdateAppointment Error:", e.message);
    res.status(500).json({ message: "Failed to update appointment" });
  }
}

export async function cancelAppointment(req, res) {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (!canAccess(req.user, appt))
      return res.status(403).json({ message: "Forbidden" });

    appt.status = "cancelled";
    await appt.save();
    res.json({ message: "Cancelled", id: appt._id });
  } catch (e) {
    console.error("CancelAppointment Error:", e.message);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
}

export async function joinAppointment(req, res) {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (!canAccess(req.user, appt))
      return res.status(403).json({ message: "Forbidden" });

    if (appt.type !== "video") {
      return res
        .status(400)
        .json({ message: "Join is only available for video sessions" });
    }

    const now = new Date();
    const early = new Date(appt.datetime.getTime() - 15 * 60 * 1000);
    const late = new Date(appt.datetime.getTime() + 3 * 60 * 60 * 1000);

    if (now < early)
      return res
        .status(400)
        .json({ message: "Join available 15 minutes before the session." });

    if (!appt.meetingUrl) {
      appt.meetingUrl = `${
        process.env.APP_BASE_URL || "https://app.swasthamann.local"
      }/video/${appt._id}`;
      await appt.save();
    }

    res.json({ url: appt.meetingUrl, validUntil: late });
  } catch (e) {
    console.error("JoinAppointment Error:", e.message);
    res.status(500).json({ message: "Failed to get join URL" });
  }
}
