import React, { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    // API call here
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      {submitted ? (
        <div>Thank you! We'll get back to you soon.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default Contact;
