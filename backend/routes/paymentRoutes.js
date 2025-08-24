// backend/routes/paymentRoutes.js
import express from "express";
import crypto from "crypto";

const router = express.Router();

router.post("/create-intent", (req, res) => {
  const { amount } = req.body;
  const transaction_uuid = Date.now().toString();

  const payload = {
    amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid,
    product_code: "EPAYTEST",
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: "http://localhost:3000/payment/success",
    failure_url: "http://localhost:3000/payment/failure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };

  // generate signature
  const secretKey = "8gBm/:&EnhH.1/q"; // sandbox secret key
  const data = payload.signed_field_names
    .split(",")
    .map((f) => `${f}=${payload[f]}`)
    .join(",");
  payload.signature = crypto
    .createHmac("sha256", secretKey)
    .update(data)
    .digest("base64");

  res.json({ formUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form", payload });
});

export default router;
