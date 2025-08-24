import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import {
  createFeedback,
  myFeedback,
  reviewsForTherapist,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";
import {
  createFeedbackSchema,
  updateFeedbackSchema,
} from "../validators/feedback.validator.js";

const router = Router();

router.post("/", protect, validate(createFeedbackSchema), createFeedback);
router.get("/my", protect, myFeedback);
router.get("/therapist/:therapistId", protect, reviewsForTherapist);
router.patch("/:id", protect, validate(updateFeedbackSchema), updateFeedback);
router.delete("/:id", protect, deleteFeedback);

export default router;
