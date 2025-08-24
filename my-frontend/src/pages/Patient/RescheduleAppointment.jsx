// src/pages/Patient/RescheduleAppointment.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../services/api"; // your axios instance

export default function RescheduleAppointment() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Optional prefill from link state: { datetime: ISOString }
  const seedISO = location.state?.datetime || "";
  const [date, setDate] = useState(seedISO ? seedISO.slice(0, 10) : "");
  const [time, setTime] = useState(seedISO ? seedISO.slice(11, 16) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // (Optional) fetch existing appointment to prefill if no state provided
  useEffect(() => {
    const load = async () => {
      if (seedISO || !appointmentId) return;
      try {
        // If you have an endpoint like GET /api/appointments/:id
        const { data } = await api.get(`/appointments/${appointmentId}`);
        if (data?.datetime) {
          const iso = new Date(data.datetime).toISOString();
          setDate(iso.slice(0, 10));
          setTime(iso.slice(11, 16));
        }
      } catch (e) {
        // Non-blocking: user can still pick a date/time
      }
    };
    load();
  }, [appointmentId, seedISO]);

  const handleReschedule = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || !time) {
      setError("Please choose both date and time.");
      return;
    }

    // Combine date & time to ISO in local tz
    const localISO = new Date(`${date}T${time}`).toISOString();

    try {
      setLoading(true);

      // Use the route your backend exposes:
      // Example A (PUT replace):  PUT /api/appointments/:id  { datetime }
      // Example B (PATCH partial): PATCH /api/appointments/:id { datetime }
      await api.put(`/appointments/${appointmentId}`, { datetime: localISO });

      navigate("/appointments/calendar", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reschedule. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Reschedule Appointment</h2>

      <form onSubmit={handleReschedule} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          New Date
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          New Time
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>

        {error && (
          <div style={{ color: "#b00020", fontWeight: 600 }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Rescheduling…" : "Reschedule"}
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
