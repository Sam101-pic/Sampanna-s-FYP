import React, { useState } from "react";

const ReviewSession = () => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    // Submit review to API here
  };

  return (
    <div className="review-session">
      <h2>Leave a Review</h2>
      {submitted ? (
        <div>Thank you for your feedback!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Rating:
            <select value={rating} onChange={e => setRating(Number(e.target.value))} required>
              <option value={0}>Select</option>
              {[1,2,3,4,5].map((num) => (
                <option value={num} key={num}>{num} Star{num > 1 && "s"}</option>
              ))}
            </select>
          </label>
          <label>
            Review:
            <textarea value={text} onChange={e => setText(e.target.value)} required />
          </label>
          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
};

export default ReviewSession;
