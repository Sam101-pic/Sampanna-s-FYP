import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import feedbackService from "../../services/feedbackService";
import "./Feedback.css";

export default function Feedback() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ therapistId: "", rating: 5, comment: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await feedbackService.my();
        if (mounted) setReviews(data || []);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || "Failed to load feedback");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const s = reviews.reduce((a, r) => a + (r.rating || 0), 0);
    return (s / reviews.length).toFixed(1);
  }, [reviews]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.therapistId) {
      setError("Please enter therapist userId (24-char ObjectId).");
      return;
    }
    try {
      const saved = await feedbackService.create({
        reviewed: form.therapistId,
        rating: Number(form.rating),
        comment: form.comment.trim(),
      });
      setReviews((p) => [saved, ...p]);
      setForm({ therapistId: "", rating: 5, comment: "" });
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="fb-root">
      <Sidebar active="Feedback" />
      <main className="fb-main">
        <header className="fb-head">
          <h1>🌟 Feedback</h1>
          <p className="fb-sub">Share your experience and check your past reviews</p>
        </header>

        <div className="fb-stats">
          <div className="fb-card highlight">
            <div className="fb-card-value">{avgRating}</div>
            <div className="fb-card-label">Average Rating</div>
          </div>
          <div className="fb-card">
            <div className="fb-card-value">{reviews.length}</div>
            <div className="fb-card-label">Total Reviews</div>
          </div>
        </div>

        <section className="fb-grid">
          <div className="fb-left">
            <h3>✍️ Write a Review</h3>
            <form className="fb-form" onSubmit={submit}>
              <label>
                Therapist User ID
                <input
                  placeholder="e.g. 6648a2c6b3d2f8d0e1a2b3c4"
                  value={form.therapistId}
                  onChange={e => setForm({ ...form, therapistId: e.target.value })}
                  required
                />
              </label>
              <label>
                Rating
                <div className="fb-rating-range">
                  <input
                    type="range" min="1" max="5" step="1"
                    value={form.rating}
                    onChange={e => setForm({ ...form, rating: e.target.value })}
                  />
                  <span className="fb-range-val">⭐ {form.rating}</span>
                </div>
              </label>
              <label>
                Comment (optional)
                <textarea
                  rows="4"
                  maxLength={2000}
                  placeholder="Write your feedback..."
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                />
              </label>
              {error && <div className="fb-error">{error}</div>}
              <button className="fb-btn" type="submit">Submit Feedback</button>
            </form>
          </div>

          <div className="fb-right">
            <h3>📋 Your Reviews</h3>
            {loading ? (
              <div className="fb-skel">Loading…</div>
            ) : reviews.length === 0 ? (
              <div className="fb-empty">You haven’t submitted any reviews yet.</div>
            ) : (
              <ul className="fb-list">
                {reviews.map(r => (
                  <li key={r.id || r._id} className="fb-item">
                    <div className="fb-item-top">
                      <div className="fb-rating">⭐ {r.rating}</div>
                      <div className="fb-date">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="fb-meta">Therapist: {r.reviewed?.name || r.reviewed || "—"}</div>
                    {r.comment && <div className="fb-comment">“{r.comment}”</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
