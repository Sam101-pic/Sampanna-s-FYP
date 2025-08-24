import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaSearch,
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaGlobe,
  FaCalendarAlt,
  FaComments,
  FaShieldAlt,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import "./TherapistList.css";

// ✅ API base already includes /api (from .env)
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const LIST_URL = `${API_BASE}/therapists`;

// ---------- Helpers ----------
function mapTherapist(t) {
  const id = t._id || t.id; // must be Mongo ObjectId
  const name = t.name || t.user?.name || "Therapist";

  const headline =
    t.headline ||
    t.specialization ||
    (Array.isArray(t.specializations) ? t.specializations.join(" • ") : "") ||
    "Licensed Therapist";

  const fee = t.fee || 100;
  const years = t.years || 5;
  const location = t.location || "Online";
  const nextSlot = t.nextSlot || "This Week";
  const languages = Array.isArray(t.languages)
    ? t.languages
    : typeof t.languages === "string"
    ? t.languages.split(",").map((s) => s.trim())
    : ["English"];

  const rating = t.rating || 4.8;
  const reviews = t.reviews || 0;
  const summary =
    t.summary || "Compassionate, evidence-based care tailored to your goals.";
  const tags = Array.isArray(t.tags) ? t.tags : [];

  const match =
    typeof t.match === "number"
      ? t.match
      : Math.min(99, 70 + Math.floor((rating - 4) * 20) + Math.min(10, years));

  const avatar = t.avatar || t.avatarUrl || t.user?.avatar;

  return {
    id,
    name,
    headline,
    match,
    fee,
    years,
    location,
    nextSlot,
    languages,
    rating,
    reviews,
    summary,
    tags,
    avatar,
  };
}

// ---------- Filters ----------
const ALL_SPECIALIZATIONS = [
  "All Specializations",
  "Anxiety",
  "Depression",
  "Trauma",
  "PTSD",
  "Relationships",
  "Couples",
  "CBT",
  "EMDR",
];
const ALL_TIMES = ["Any Time", "Today", "Tomorrow", "This Week"];

// ---------- Component ----------
export default function TherapistList() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("All Specializations");
  const [when, setWhen] = useState("Any Time");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [raw, setRaw] = useState([]);

  // --- Fetch therapists ---
  useEffect(() => {
    let abort = false;

    async function load() {
      try {
        setLoading(true);
        setErr("");

        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (spec !== "All Specializations") params.set("spec", spec);
        if (when !== "Any Time") params.set("when", when);

        const url = `${LIST_URL}${params.toString() ? `?${params.toString()}` : ""}`;
        console.log("🔍 Fetching:", url);

        const res = await fetch(url);
        if (!res.ok)
          throw new Error(`Failed to load therapists (${res.status})`);

        const data = await res.json();
        if (abort) return;

        const arr =
          Array.isArray(data?.therapists) ? data.therapists
          : Array.isArray(data) ? data
          : Array.isArray(data?.items) ? data.items
          : [];

        setRaw(arr);
      } catch (e) {
        if (!abort) setErr(e.message || "Failed to load");
        setRaw([]);
      } finally {
        if (!abort) setLoading(false);
      }
    }

    const t = setTimeout(load, q ? 300 : 0);
    return () => {
      abort = true;
      clearTimeout(t);
    };
  }, [q, spec, when]);

  // --- Apply filters ---
  const list = useMemo(() => {
    const mapped = raw.map(mapTherapist);
    return mapped.filter((t) => {
      const text = (
        t.name +
        " " +
        t.headline +
        " " +
        (t.tags || []).join(" ")
      ).toLowerCase();
      const passQ = q.trim() ? text.includes(q.trim().toLowerCase()) : true;
      const passSpec =
        spec === "All Specializations"
          ? true
          : (t.tags || []).some(
              (tag) => tag.toLowerCase() === spec.toLowerCase()
            );
      const passTime =
        when === "Any Time"
          ? true
          : when === "Today"
          ? /today/i.test(String(t.nextSlot))
          : when === "Tomorrow"
          ? /tomorrow/i.test(String(t.nextSlot))
          : when === "This Week"
          ? /week|soon|this/i.test(String(t.nextSlot))
          : true;

      return passQ && passSpec && passTime;
    });
  }, [raw, q, spec, when]);

  // --- UI ---
  return (
    <div className="tl-root">
      <Sidebar active="Find Therapist" />

      <main className="tl-main">
        <header className="tl-header">
          <h1>Find Your Perfect Therapist</h1>
          <p>
            AI-powered matching to connect you with the right mental health
            professional
          </p>
        </header>

        {/* Filter Bar */}
        <section className="tl-filter">
          <div className="tl-filter-title">
            <FaFilter /> Filter Therapists
          </div>

          <div className="tl-filter-row">
            <div className="tl-search">
              <FaSearch />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or specialization"
                aria-label="Search therapists"
              />
            </div>

            <div className="tl-select">
              <select
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                aria-label="Filter by specialization"
              >
                {ALL_SPECIALIZATIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <span className="tl-caret">▾</span>
            </div>

            <div className="tl-select">
              <select
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                aria-label="Filter by time"
              >
                {ALL_TIMES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <span className="tl-caret">▾</span>
            </div>
          </div>
        </section>

        {/* Status Messages */}
        {loading && <div className="tl-status">Loading therapists…</div>}
        {!loading && err && (
          <div className="tl-status tl-error">
            Failed to load therapists: {err}
          </div>
        )}
        {!loading && !err && list.length === 0 && (
          <div className="tl-status">No therapists match your filters.</div>
        )}

        {/* Results */}
        <section className="tl-list">
          {list.map((t) => (
            <article className="tl-card" key={t.id}>
              <div className="tl-card-left">
                <div
                  className="tl-avatar"
                  style={
                    t.avatar ? { backgroundImage: `url(${t.avatar})` } : undefined
                  }
                />
                <div className="tl-match">{t.match}% match</div>
                <div className="tl-fee">${t.fee}/session</div>
              </div>

              <div className="tl-card-mid">
                <div className="tl-card-top">
                  <div>
                    <Link to={`/therapists/${t.id}`} className="tl-name">
                      {t.name}
                    </Link>
                    <div className="tl-headline">{t.headline}</div>
                  </div>
                  <div className="tl-rating">
                    <FaStar /> {Number(t.rating).toFixed(1)}
                    <span className="tl-reviews">({t.reviews} reviews)</span>
                  </div>
                </div>

                <p className="tl-summary">{t.summary}</p>

                <div className="tl-meta">
                  <span>
                    <FaShieldAlt /> {t.years} years
                  </span>
                  <span>
                    <FaMapMarkerAlt /> {t.location || "Online"}
                  </span>
                  <span>
                    <FaClock /> {t.nextSlot}
                  </span>
                  <span>
                    <FaGlobe /> Languages: {(t.languages || []).join(", ")}
                  </span>
                </div>

                <div className="tl-actions">
                  <Link to={`/appointments/book/${t.id}`} className="btn-primary">
                    <FaCalendarAlt /> Book Video Session
                  </Link>
                  <Link to={`/consultation/${t.id}`} className="btn-outline">
                    <FaComments /> Send Message
                  </Link>
                  <Link to={`/therapists/${t.id}`} className="btn-link">
                    View Profile
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
