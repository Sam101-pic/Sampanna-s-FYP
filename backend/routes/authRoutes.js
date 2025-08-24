import { Router } from 'express';
import { register, login, loginAdmin } from '../controllers/authController.js';
import validate from '../middlewares/validate.js';
import { registerSchema } from '../validators/user.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', login);
router.post('/admin/login', loginAdmin);

export default router;
