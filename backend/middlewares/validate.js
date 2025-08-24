// backend/middlewares/validate.js
import { ZodError } from "zod";

/**
 * Middleware to validate request body against a Zod schema
 * @param {ZodSchema} schema - The Zod validation schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};

export default validate;
