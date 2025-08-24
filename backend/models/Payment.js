// backend/models/Payment.js
import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    method: { type: String, enum: ["esewa", "khalti", "card", "paypal"], default: "esewa" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export default model("Payment", paymentSchema);
