import React from "react";

const plans = [
  { name: "Pay Per Session", price: "NPR 500", features: ["One consultation", "Chat/Video", "No subscription needed"] },
  { name: "Monthly Plan", price: "NPR 1800", features: ["Unlimited sessions", "Priority support", "Cancel anytime"] },
  { name: "Yearly Plan", price: "NPR 15,000", features: ["Unlimited sessions", "Personalized care", "Save 20%"] },
];

const SubscriptionPlans = () => (
  <div className="subscription-plans">
    <h2>Subscription Plans</h2>
    <div className="plan-list">
      {plans.map((plan, idx) => (
        <div className="plan-card" key={idx}>
          <h3>{plan.name}</h3>
          <div className="plan-price">{plan.price}</div>
          <ul>
            {plan.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          <button>Select Plan</button>
        </div>
      ))}
    </div>
  </div>
);

export default SubscriptionPlans;
