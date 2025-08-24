import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // patient + therapist
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });

export default mongoose.model("Thread", threadSchema);
