import React, { useEffect, useState } from "react";

const RatingsList = ({ therapistId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`http://localhost:5000/api/feedback/therapist/${therapistId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load ratings");
        return res.json();
      })
      .then((data) => { setRatings(data); setLoading(false); })
      .catch((err) => { setLoading(false); setError(err.message); });
  }, [therapistId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (ratings.length === 0) return <div>No ratings yet.</div>;

  return (
    <div className="ratings-list">
      <h2>Session Ratings & Feedback</h2>
      <ul>
        {ratings.map((r, i) => (
          <li key={i}>
            <b>{r.user?.name || r.user || "Anonymous"}</b>:{" "}
            {Array(r.rating).fill("⭐").join("")}
            <br />
            <i>{r.text}</i>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RatingsList;
