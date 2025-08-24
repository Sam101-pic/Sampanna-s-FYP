import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getThreads, getMessages, startThread, sendMessage, v } from "../controllers/chatController.js";

const router = Router();

router.use(protect);

router.get("/threads", getThreads);
router.post("/threads", v.startThread, startThread);
router.get("/threads/:threadId/messages", v.threadId, getMessages);
router.post("/threads/:threadId/messages", v.sendMessage, sendMessage);

export default router;
