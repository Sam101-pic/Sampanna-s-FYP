import { z } from "zod";

// POST /register
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z.string().min(6, { message: "Password must be at least 6 characters" }),

  role: z.enum(["patient", "therapist", "admin"]).optional(),

  language: z.string().optional(),
});

// GET /:id
export const idSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, {
    message: "Invalid ID format (must be a MongoDB ObjectId)",
  }),
});

// GET /search?name=xyz
export const searchSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
});
