import { Schema, model } from 'mongoose';

const matchRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  issueType: String,
  language: String,
  createdAt: { type: Date, default: Date.now },
});

export default model('MatchRequest', matchRequestSchema);