// backend/controllers/feedbackController.js
import Review from "../models/Review.js";
import User from "../models/User.js";

/** shape helper */
const toPlain = (r) => ({
  id: r._id,
  reviewer: r.reviewer,
  reviewed: r.reviewed,
  rating: r.rating,
  comment: r.comment || "",
  type: r.type,
  appointmentId: r.appointmentId || undefined,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

/** permission: owner or admin */
const canEdit = (user, review) =>
  user?.role === "admin" || String(review.reviewer) === String(user._id);

/**
 * POST /api/feedback
 * body: { reviewed: therapistUserId, rating: 1..5, comment?, appointmentId? }
 */
export async function createFeedback(req, res) {
  try {
    const { reviewed, rating, comment, appointmentId } = req.body;

    // ensure therapist user exists (optional but good)
    const target = await User.findById(reviewed).select("role name");
    if (!target) return res.status(404).json({ message: "Therapist not found" });

    // (Optional) prevent duplicate for same appointment
    if (appointmentId) {
      const dup = await Review.findOne({
        reviewer: req.user._id,
        reviewed,
        appointmentId,
        type: "therapist",
      });
      if (dup) return res.status(409).json({ message: "You already reviewed this appointment" });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewed,
      rating: Number(rating),
      comment: comment?.trim() || "",
      appointmentId,
      type: "therapist",
    });

    res.status(201).json(toPlain(review));
  } catch (e) {
    res.status(500).json({ message: "Failed to create feedback" });
  }
}

/** GET /api/feedback/my  -> reviews by logged-in user */
export async function myFeedback(req, res) {
  try {
    const items = await Review.find({ reviewer: req.user._id, type: "therapist" })
      .sort({ createdAt: -1 })
      .populate("reviewed", "name role")
      .lean();
    res.json(items.map((x) => ({ ...x, id: x._id })));
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch your feedback" });
  }
}

/** GET /api/feedback/therapist/:therapistId -> list + summary */
export async function reviewsForTherapist(req, res) {
  try {
    const { therapistId } = req.params;

    const items = await Review.find({ reviewed: therapistId, type: "therapist" })
      .sort({ createdAt: -1 })
      .populate("reviewer", "name role")
      .lean();

    const count = items.length;
    const avg =
      count === 0
        ? 0
        : Math.round(
            (items.reduce((a, r) => a + (r.rating || 0), 0) / count) * 10
          ) / 10;

    res.json({
      therapistId,
      summary: { count, avg },
      items: items.map((x) => ({ ...x, id: x._id })),
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch therapist feedback" });
  }
}

/** PATCH /api/feedback/:id  (owner or admin) */
export async function updateFeedback(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Feedback not found" });
    if (!canEdit(req.user, review)) return res.status(403).json({ message: "Forbidden" });

    const { rating, comment } = req.body;
    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = String(comment).trim();

    await review.save();
    res.json(toPlain(review));
  } catch (e) {
    res.status(500).json({ message: "Failed to update feedback" });
  }
}

/** DELETE /api/feedback/:id  (owner or admin) */
export async function deleteFeedback(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Feedback not found" });
    if (!canEdit(req.user, review)) return res.status(403).json({ message: "Forbidden" });

    await review.deleteOne();
    res.json({ message: "Deleted", id: review._id });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete feedback" });
  }
}
