// backend/middlewares/errorMiddleware.js

/**
 * Centralized error handling middleware.
 * Catches errors thrown in routes/controllers and returns JSON responses.
 */
const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Error:", err.stack || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // only show stack in development
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorMiddleware;
