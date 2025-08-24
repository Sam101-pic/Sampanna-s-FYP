// routes/devRoutes.js
import { Router } from "express";
import User from "../models/User.js";

const router = Router();

/**
 * 🔧 Dev Utility: Create Admin Account
 * Email: admin@swasthamann.com
 * Password: Admin@123
 */
router.post("/create-admin", async (req, res) => {
  try {
    // ❌ Delete existing admin with same email
    await User.deleteOne({ email: "admin@swasthamann.com" });

    // ✅ Insert new admin (password will be hashed via Mongoose pre-save hook)
    const admin = new User({
      name: "Sampanna Admin",
      email: "admin@swasthamann.com",
      password: "Admin@123", // plain, to be hashed in model
      role: "admin",
      isVerified: true,
      language: "English",
    });

    await admin.save();

    res.status(201).json({ message: "✅ Admin created successfully" });
  } catch (err) {
    console.error("❌ Admin Creation Error:", err);
    res.status(500).json({ message: "Error creating admin", error: err.message });
  }
});

export default router;
