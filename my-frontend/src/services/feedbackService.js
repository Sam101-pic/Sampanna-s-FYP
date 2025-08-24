// src/services/feedbackService.js
import api from "./api";

// Feedback (reviews) endpoints.  The backend exposes these under `/feedback`.
const feedbackService = {
  // Get feedback authored by the currently authenticated user.
  my: () => api.get("/feedback/my").then((r) => r.data),
  // List all feedback for a specific therapist by their user id.
  forTherapist: (therapistId) =>
    api.get(`/feedback/therapist/${therapistId}`).then((r) => r.data),
  // Create a new feedback entry.  Note that the backend does not use the
  // `type` field, so only `reviewed`, `rating`, and `comment` are sent.
  create: ({ reviewed, rating, comment }) =>
    api.post("/feedback", { reviewed, rating, comment }).then((r) => r.data),
};

export default feedbackService;
