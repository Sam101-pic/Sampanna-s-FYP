// backend/validators/chat.validator.js
import Joi from 'joi';

export const sendMessageSchema = Joi.object({
  senderId: Joi.string().required().messages({
    "any.required": "Sender ID is required",
    "string.empty": "Sender ID cannot be empty",
  }),
  receiverId: Joi.string().required().messages({
    "any.required": "Receiver ID is required",
    "string.empty": "Receiver ID cannot be empty",
  }),
  message: Joi.string().min(1).max(500).required().messages({
    "any.required": "Message is required",
    "string.empty": "Message cannot be empty",
    "string.max": "Message cannot exceed 500 characters",
  }),
});
