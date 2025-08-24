import React, { useState } from "react";
import { Link } from "react-router-dom";

const TherapistMatchAI = () => {
  const [recommendation, setRecommendation] = useState(null);

  const handleFind = () => {
    // Simulate AI therapist matching result
    setRecommendation({
      id: 2,
      name: "Dr. Sunil Shrestha",
      specialty: "Depression",
      reason: "Best match based on your answers and availability.",
    });
  };

  return (
    <div className="therapist-match-ai">
      <h2>AI Therapist Match</h2>
      <p>Click below to find your best therapist match:</p>
      <button onClick={handleFind}>Find My Match</button>
      {recommendation && (
        <div className="ai-result">
          <p><b>Recommended:</b> {recommendation.name} ({recommendation.specialty})</p>
          <p><i>{recommendation.reason}</i></p>
          <Link to={`/therapists/${recommendation.id}`}>View Profile</Link>
        </div>
      )}
    </div>
  );
};

export default TherapistMatchAI;
