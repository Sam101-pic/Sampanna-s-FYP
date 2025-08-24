import { Router } from 'express';
import { match } from '../controllers/matchController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const { protect } = authMiddleware;
const router = Router();

router.post('/', protect, match);

export default router;