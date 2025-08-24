import React, { useMemo, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar, FaMapMarkerAlt, FaClock, FaGlobe, FaDollarSign,
  FaCalendarAlt, FaComments, FaShieldAlt, FaGraduationCap
} from "react-icons/fa";
import "./TherapistDetails.css";

// NOTE: The placeholder constant has been removed.  The component now
// fetches the therapist details and their reviews from the backend.  If
// nothing is returned, sensible defaults are used.

// Helper to map backend therapist model into the shape expected by the UI.
function mapTherapist(t) {
  if (!t) return null;
  const id = t._id || t.id;
  const name = t.name || t.user?.name || t.profile?.name || "Therapist";
  const headline =
    t.headline ||
    t.specialization ||
    (Array.isArray(t.specializations) ? t.specializations.join(" • ") : "") ||
    t.profile?.headline ||
    "Licensed Therapist";
  const fee = t.fee || t.hourlyRate || t.sessionFee || t.profile?.fee || 0;
  const years =
    t.years ||
    t.yearsExperience ||
    t.experienceYears ||
    t.profile?.yearsExperience ||
    0;
  const location =
    t.location ||
    [t.city, t.country].filter(Boolean).join(", ") ||
    t.profile?.location ||
    "Online";
  const languages = Array.isArray(t.languages)
    ? t.languages
    : typeof t.languages === "string"
    ? t.languages.split(",").map((s) => s.trim())
    : t.profile?.languages || [];
  const bio = t.bio || t.about || t.summary || t.profile?.bio || "";
  const specialties =
    t.specialties || t.specializations || t.tags || t.profile?.specialties || [];
  const education = t.education || t.profile?.education || "";
  const license = t.license || t.profile?.license || "";
  const avatarUrl = t.avatar || t.avatarUrl || t.user?.avatar || t.profile?.avatar;
  // rating and reviews count may be provided by the reviews API, but fall back
  // to values on the therapist object.  If `t.rating` is a number use it
  // directly; otherwise fall through to possible nested values.
  let rating;
  if (typeof t.rating === "number") rating = t.rating;
  else rating = t.rating?.average || t.ratingAvg || t.avgRating || 0;
  const reviewsCount =
    typeof t.reviews === "number"
      ? t.reviews
      : t.rating?.count || t.reviewsCount || t.totalReviews || 0;
  return {
    id,
    name,
    headline,
    fee,
    years,
    location,
    languages,
    bio,
    specialties,
    education,
    license,
    avatarUrl,
    rating,
    reviewsCount,
  };
}

export default function TherapistDetails() {
  const { id = "" } = useParams();
  // Base API path.  Include `/api` by default so relative calls work.
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const [therapist, setTherapist] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch therapist details and reviews whenever the id changes.
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // Fetch the therapist profile
        const resT = await fetch(`${API_BASE}/therapists/${id}`);
        if (resT.ok) {
          const data = await resT.json();
          if (mounted) setTherapist(mapTherapist(data));
        }
        // Fetch reviews for this therapist.  The backend returns an object
        // containing { average, count, items }.  We update the reviews state
        // with the items array and, if present, attach the count to the
        // therapist object.
        const resR = await fetch(`${API_BASE}/therapists/${id}/reviews`);
        if (resR.ok) {
          const dataR = await resR.json();
          if (mounted) {
            setReviews(Array.isArray(dataR?.items) ? dataR.items : []);
            // If we already fetched the therapist details, merge the reviews
            // count into the object so ratings and counts display correctly.
            setTherapist((prev) =>
              prev ? { ...prev, rating: dataR.average ?? prev.rating, reviewsCount: dataR.count ?? prev.reviewsCount } : prev
            );
          }
        }
      } catch (err) {
        console.warn("Failed to load therapist details:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Derive a match score from ratings and years of experience.  If there is no
  // therapist loaded yet, return a placeholder.
  const match = useMemo(() => {
    if (!therapist) return "";
    const base = 70;
    const ratingBoost = (therapist.rating - 4) * 20;
    const yearBoost = Math.min(10, therapist.years || 0);
    return `${Math.min(99, base + (ratingBoost || 0) + yearBoost)}% match`;
  }, [therapist]);

  if (loading) {
    return <div className="td-wrap"><div className="td-status">Loading…</div></div>;
  }
  if (!therapist) {
    return <div className="td-wrap"><div className="td-status">Therapist not found</div></div>;
  }

  return (
    <div className="td-wrap">
      {/* Top: name + actions */}
      <header className="td-hero">
        <div className="td-hero-left">
          <div className="td-avatar" aria-hidden>
            {therapist.avatarUrl && (
              <img src={therapist.avatarUrl} alt={therapist.name} />
            )}
          </div>
          <div className="td-head">
            <h1 className="td-name">{therapist.name}</h1>
            <div className="td-headline">{therapist.headline}</div>

            <div className="td-meta">
              <span className="td-chip">
                <FaStar /> {therapist.rating.toFixed(1)} <span className="td-muted">({therapist.reviewsCount} reviews)</span>
              </span>
              {match && (
                <>
                  <span className="td-dot" />
                  <span className="td-muted">{match}</span>
                </>
              )}
            </div>

            {therapist.specialties && therapist.specialties.length > 0 && (
              <div className="td-tags">
                {therapist.specialties.slice(0, 5).map((tag) => (
                  <span key={tag} className="td-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="td-hero-right">
          <div className="td-quick grid">
            <div className="td-quick-item">
              <div className="td-quick-icon"><FaDollarSign /></div>
              <div>
                <div className="td-quick-label">Fee</div>
                <div className="td-quick-value">${therapist.fee || 0}/session</div>
              </div>
            </div>
            <div className="td-quick-item">
              <div className="td-quick-icon"><FaClock /></div>
              <div>
                <div className="td-quick-label">Experience</div>
                <div className="td-quick-value">{therapist.years || 0} years</div>
              </div>
            </div>
            <div className="td-quick-item">
              <div className="td-quick-icon"><FaMapMarkerAlt /></div>
              <div>
                <div className="td-quick-label">Location</div>
                <div className="td-quick-value">{therapist.location || "Online"}</div>
              </div>
            </div>
            <div className="td-quick-item">
              <div className="td-quick-icon"><FaGlobe /></div>
              <div>
                <div className="td-quick-label">Languages</div>
                <div className="td-quick-value">{(therapist.languages || []).join(", ")}</div>
              </div>
            </div>
          </div>

          <div className="td-actions">
            <Link to={`/appointments/book/${therapist.id}`} className="td-btn td-btn--primary">
              <FaCalendarAlt /> Book Video Session
            </Link>
            <Link to={`/consultation`} className="td-btn td-btn--outline">
              <FaComments /> Send Message
            </Link>
          </div>
        </div>
      </header>

      {/* Body grid */}
      <div className="td-grid">
        {/* Left column */}
        <section className="td-panel">
          <h3 className="td-panel-title">About</h3>
          <p className="td-body-text">{therapist.bio || "No bio available."}</p>

          <div className="td-split">
            {therapist.education && (
              <div className="td-split-item">
                <div className="td-split-icon"><FaGraduationCap /></div>
                <div>
                  <div className="td-split-label">Education</div>
                  <div className="td-split-value">{therapist.education}</div>
                </div>
              </div>
            )}
            {therapist.license && (
              <div className="td-split-item">
                <div className="td-split-icon"><FaShieldAlt /></div>
                <div>
                  <div className="td-split-label">License</div>
                  <div className="td-split-value">{therapist.license}</div>
                </div>
              </div>
            )}
          </div>

          {therapist.specialties && therapist.specialties.length > 0 && (
            <>
              <h3 className="td-panel-title" style={{ marginTop: 16 }}>Specializations</h3>
              <div className="td-tags">
                {therapist.specialties.map((tag) => (
                  <span key={tag} className="td-tag">{tag}</span>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Right column */}
        <aside className="td-panel">
          <div className="td-panel-header">
            <h3 className="td-panel-title">Availability</h3>
            <Link to={`/appointments/book/${therapist.id}`} className="td-pill">View Calendar</Link>
          </div>
          {/* The backend could expose a /slots endpoint; until then show a placeholder. */}
          <ul className="td-slots">
            {[
              "Today 3:00 PM",
              "Today 5:00 PM",
              "Tomorrow 10:00 AM",
            ].map((s) => (
              <li key={s} className="td-slot-row">
                <span>{s}</span>
                <Link to={`/appointments/book/${therapist.id}`} className="td-mini-btn">Book</Link>
              </li>
            ))}
          </ul>

          {therapist.languages && therapist.languages.length > 0 && (
            <>
              <h3 className="td-panel-title" style={{ marginTop: 12 }}>Languages</h3>
              <div className="td-tags">
                {therapist.languages.map((lang) => (
                  <span key={lang} className="td-tag">{lang}</span>
                ))}
              </div>
            </>
          )}

          <h3 className="td-panel-title" style={{ marginTop: 12 }}>Session Fee</h3>
          <div className="td-fee-box">
            <FaDollarSign /> <span>${therapist.fee || 0} / session</span>
          </div>
        </aside>
      </div>

      {/* Reviews preview */}
      <section className="td-panel">
        <div className="td-panel-header">
          <h3 className="td-panel-title">Reviews</h3>
          <Link to={`/therapists/${therapist.id}#reviews`} className="td-pill">View All</Link>
        </div>
        <div className="td-reviews">
          {reviews && reviews.length > 0 ? (
            reviews.slice(0, 2).map((r) => (
              <div key={r._id || r.id} className="td-review">
                <div className="td-review-header">
                  <div className="td-review-avatar" />
                  <div>
                    <div className="td-review-name">{r.user?.name || r.user || "Anonymous"}</div>
                    <div className="td-review-meta"><FaStar /> {Number(r.rating).toFixed(1)}</div>
                  </div>
                </div>
                {r.comment && <p className="td-review-text">{r.comment}</p>}
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
