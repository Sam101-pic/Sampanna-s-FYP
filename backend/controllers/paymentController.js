// backend/controllers/paymentController.js
import Payment from "../models/Payment.js";

export async function processPayment(req, res) {
  try {
    const { appointmentId, amount, transactionId, method } = req.body;

    if (!appointmentId || !amount || !transactionId) {
      return res.status(400).json({
        message: "appointmentId, amount, and transactionId are required",
      });
    }

    const payment = await Payment.create({
      userId: req.user._id,
      appointmentId,
      amount,
      transactionId,
      status: "paid", // default to paid for now
      method: method || "esewa",
    });

    res.status(201).json(payment);
  } catch (err) {
    console.error("ProcessPayment Error:", err.message);
    res.status(500).json({
      message: "Failed to process payment",
      error: err.message,
    });
  }
}

export async function getPayments(req, res) {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate("appointmentId", "datetime status")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error("GetPayments Error:", err.message);
    res.status(500).json({
      message: "Failed to fetch payments",
      error: err.message,
    });
  }
}
