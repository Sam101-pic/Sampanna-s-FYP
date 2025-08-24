import { Router } from 'express';
import { startSession } from '../controllers/videoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const { protect } = authMiddleware;
const router = Router();

router.post('/start', protect, startSession);

export default router;