import React, { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaVideo } from "react-icons/fa";
import "./BookAppointment.css";

export default function BookAppointment() {
  const { therapistId } = useParams();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );

  // yyyy-mm-dd (today) for min attribute
  const today = useMemo(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!date || !time) return;

    // prevent past datetime
    const candidate = new Date(`${date}T${time}:00`);
    if (candidate.getTime() < Date.now()) {
      alert("Please choose a time in the future.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate(`/auth/login?redirect=/therapists/${therapistId}/book`);
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/appointments/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            therapistId,
            datetime: candidate.toISOString(),
            type: "video",
            notes,
            timezone: tz,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Booking failed");
      }

      alert("✅ Appointment booked!");
      navigate("/appointments/calendar");
    } catch (err) {
      alert("❌ " + (err?.message || "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bk-shell">
      <main className="bk-main">
        <header className="bk-header">
          <div className="bk-title">
            <FaVideo className="bk-title-icon" />
            <div>
              <h1>Book Video Session</h1>
              <p>Pick a date and time for your appointment</p>
            </div>
          </div>
          <Link to={`/therapists/${therapistId}`} className="bk-link">
            ← Back to therapist
          </Link>
        </header>

        <section className="bk-card">
          <form onSubmit={handleBook} className="bk-grid">
            <label className="bk-field">
              <span className="bk-label">
                <FaCalendarAlt className="bk-ico" />
                Date
              </span>
              <input
                type="date"
                required
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bk-input"
              />
            </label>

            <label className="bk-field">
              <span className="bk-label">
                <FaClock className="bk-ico" />
                Time
              </span>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bk-input"
              />
            </label>

            <div className="bk-row">
              <div className="bk-kv">
                <span className="bk-k">Session type</span>
                <span className="bk-v">Video</span>
              </div>
              <div className="bk-kv">
                <span className="bk-k">Your timezone</span>
                <span className="bk-v">{tz}</span>
              </div>
            </div>

            <label className="bk-field full">
              <span className="bk-label">Notes (optional)</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bk-textarea"
                placeholder="Anything you’d like your therapist to know ahead of time"
              />
            </label>

            <button
              type="submit"
              className="bk-btn primary full"
              disabled={submitting}
            >
              {submitting ? "Booking…" : "Confirm Booking"}
            </button>
          </form>
        </section>

        <p className="bk-fineprint">
          By booking, you agree to our Terms and Privacy Policy.
        </p>
      </main>
    </div>
  );
}
