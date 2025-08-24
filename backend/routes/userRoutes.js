import { Router } from "express";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/upload.js";
import { protect } from "../middlewares/authMiddleware.js";

import { registerSchema, idSchema, searchSchema } from "../validators/user.validator.js";
import userController from "../controllers/userController.js";

const { register, login, getMe, getUser, searchUsers, uploadAvatar } = userController;
const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/:id", validate(idSchema, "params"), getUser);
router.get("/search", validate(searchSchema, "query"), searchUsers);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;
