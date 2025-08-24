import Joi from "joi";

// validation schema for booking appointment
export const bookAppointmentSchema = Joi.object({
  therapistId: Joi.string().required().messages({
    "string.empty": "Therapist ID is required",
    "any.required": "Therapist ID is required",
  }),
  datetime: Joi.date().iso().required().messages({
    "date.base": "Datetime must be a valid ISO date",
    "any.required": "Datetime is required",
  }),
  durationMin: Joi.number().integer().min(15).max(180).optional().messages({
    "number.base": "Duration must be a number",
    "number.min": "Duration must be at least 15 minutes",
    "number.max": "Duration must be at most 180 minutes",
  }),
  type: Joi.string().valid("video", "text").default("video").messages({
    "any.only": "Type must be either 'video' or 'text'",
  }),
});

// ✅ middleware to validate request
export function validateBookAppointment(req, res, next) {
  const { error } = bookAppointmentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((d) => d.message),
    });
  }
  next();
}
