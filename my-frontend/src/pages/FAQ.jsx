import React from "react";

const faqs = [
  { q: "Is my information private?", a: "Yes! We follow GDPR and all sessions are encrypted." },
  { q: "How do I book a therapist?", a: "Register or login, then use 'Find Therapist' to book an appointment." },
  { q: "Can I choose my therapist?", a: "Yes, you can pick from available professionals or use our AI match." },
];

const FAQ = () => (
  <div className="faq-page">
    <h2>Frequently Asked Questions</h2>
    <ul>
      {faqs.map((faq, i) => (
        <li key={i}>
          <b>Q:</b> {faq.q}<br />
          <b>A:</b> {faq.a}
        </li>
      ))}
    </ul>
  </div>
);

export default FAQ;
