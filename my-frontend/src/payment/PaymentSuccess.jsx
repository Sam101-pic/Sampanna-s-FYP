import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => (
  <div className="payment-success">
    <h2>Payment Successful!</h2>
    <p>Your transaction has been completed.</p>
    <Link to="/appointments/calendar">
      <button>Go to My Appointments</button>
    </Link>
  </div>
);

export default PaymentSuccess;
