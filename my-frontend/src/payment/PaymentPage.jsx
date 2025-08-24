import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [amount, setAmount] = useState("500");
  const navigate = useNavigate();

  const handlePay = (e) => {
    e.preventDefault();
    // Payment logic here
    navigate("/payment/success");
  };

  return (
    <div className="payment-page">
      <h2>Make a Payment</h2>
      <form onSubmit={handlePay}>
        <label>
          Amount (NPR):
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </label>
        {/* Card/UPI/other fields here */}
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;
