import { Thread, Message } from "../models/Chat.js";
import { validationResult, body, param } from "express-validator";

export const v = {
  startThread: [body("therapistId").isMongoId()],
  sendMessage: [
    param("threadId").isMongoId(),
    body("text").isString().isLength({ min: 1, max: 2000 }),
  ],
  threadId: [param("threadId").isMongoId()],
};

// get all threads for logged-in user
export async function getThreads(req, res) {
  try {
    const threads = await Thread.find({ participants: req.user._id })
      .populate("participants", "name role")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean();
    res.json({ threads });
  } catch (err) {
    res.status(500).json({ message: "Failed to load threads" });
  }
}

// get messages
export async function getMessages(req, res) {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findById(threadId);
    if (!thread) return res.status(404).json({ message: "Thread not found" });
    if (!thread.participants.some((p) => String(p) === String(req.user._id)))
      return res.status(403).json({ message: "Forbidden" });

    const messages = await Message.find({ thread: threadId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 })
      .lean();

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
}

// start new thread
export async function startThread(req, res) {
  try {
    const { therapistId } = req.body;

    let thread = await Thread.findOne({
      participants: { $all: [req.user._id, therapistId] },
    }).populate("participants", "name role");

    if (!thread) {
      thread = await Thread.create({ participants: [req.user._id, therapistId] });
      thread = await thread.populate("participants", "name role");
    }

    res.status(201).json({ thread });
  } catch (err) {
    res.status(500).json({ message: "Failed to start thread" });
  }
}

// send message
export async function sendMessage(req, res) {
  try {
    const { threadId } = req.params;
    const { text } = req.body;

    const thread = await Thread.findById(threadId);
    if (!thread) return res.status(404).json({ message: "Thread not found" });
    if (!thread.participants.some((p) => String(p) === String(req.user._id)))
      return res.status(403).json({ message: "Forbidden" });

    let message = await Message.create({ thread: threadId, sender: req.user._id, text });
    message = await message.populate("sender", "name role");

    thread.lastMessage = message._id;
    await thread.save();

    const io = req.app.get("io");
    if (io) {
      thread.participants.forEach((p) => {
        io.to(String(p)).emit("newMessage", { threadId, message });
      });
    }

    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
}
