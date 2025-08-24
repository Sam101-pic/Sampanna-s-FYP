import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes — requires a valid JWT.
 */
export const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // 🔑 Log raw header
      console.log("🔑 Authorization header:", req.headers.authorization);

      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Extracted token:", token);

      // Verify token with secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded payload:", decoded);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("❌ No user found for decoded id:", decoded.id);
        return res.status(401).json({ message: "User not found" });
      }

      console.log("✅ Authenticated user:", req.user.email, "| role:", req.user.role);
      next();
    } else {
      console.log("❌ No Authorization header provided");
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    console.error("❌ Auth Error:", err.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/**
 * Middleware to check user role (e.g., admin, therapist).
 * Usage: authorizeRoles("admin"), authorizeRoles("therapist", "admin")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

// ✅ Default export (for compatibility)
export default { protect, authorizeRoles };
