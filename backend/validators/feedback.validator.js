// backend/validators/feedback.validator.js
import { z } from "zod";

const objectId = () =>
  z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

export const createFeedbackSchema = z.object({
  reviewed: objectId(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().default(""),
  appointmentId: objectId().optional(),
});

export const updateFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(2000).optional(),
});
