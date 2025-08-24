import { Router } from 'express';
import { getAllUsers, deleteUser, getAllAppointments } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
// Removed the incorrect destructuring
const router = Router();

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.delete('/users/:userId', protect, authorizeRoles('admin'), deleteUser);
router.get('/appointments', protect, authorizeRoles('admin'), getAllAppointments);

export default router;