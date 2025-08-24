import api from "./api";

// The backend mounts its payment routes under `/payments`, not `/payment`.
// These helpers wrap the endpoints exposed by `backend_extracted/backend/routes/paymentRoutes.js`.
const paymentService = {
  // Retrieve the authenticated user's past payment records.  In the simple
  // backend this endpoint is not implemented, so the consumer should handle
  // empty arrays gracefully.
  listMy: () => api.get("/payments/my").then((r) => r.data),
  // Initiate a new payment intent.  This calls `/payments/create-intent` and
  // returns the payload required to submit the form to the eSewa gateway.
  createIntent: (payload) =>
    api.post("/payments/create-intent", payload).then((r) => r.data),
  // Mark a payment as paid (for development/testing).  The backend does not
  // implement this helper so this will typically result in a 404 until
  // implemented.
  markPaidDev: (id) => api.post(`/payments/${id}/mark-paid`).then((r) => r.data),
};

export default paymentService;
