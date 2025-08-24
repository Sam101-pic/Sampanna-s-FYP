import { Router } from 'express';
const router = Router();

import {
  list,
  getOne,
  reviews,
  availability,
  createOrUpdateProfile,
  getProfileByUserId,
  getGeneratedSlots
} from '../controllers/therapistController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { param, query } from 'express-validator';

/* -------------------- Profile -------------------- */
router.post('/profile', protect, authorizeRoles('therapist'), createOrUpdateProfile);
router.get('/profile/:userId', protect, getProfileByUserId);

/* -------------------- Public Therapist Endpoints -------------------- */
router.get('/', list);                                // GET /api/therapists
router.get('/:id', getOne);                           // GET /api/therapists/:id
router.get('/:id/reviews', reviews);                  // GET /api/therapists/:id/reviews
router.get('/:id/availability', availability);        // GET /api/therapists/:id/availability

// Dynamic slots generator
router.get(
  '/:id/slots',
  [
    param('id').isMongoId().withMessage('Invalid therapist id'),
    query('startDate').optional().isISO8601().withMessage('startDate must be YYYY-MM-DD'),
    query('days').optional().isInt({ min: 1, max: 60 }).withMessage('days must be 1..60')
  ],
  getGeneratedSlots
);

export default router;
