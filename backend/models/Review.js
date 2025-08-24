import { Schema, model } from 'mongoose';

/**
 * Review Schema: For public ratings & testimonials (e.g., therapists, products)
 *
 * - reviewer: User giving the review (required)
 * - reviewed: User or entity being reviewed (required)
 * - rating: 1–5 star score (required)
 * - comment: Optional written review
 * - type: What’s being reviewed? ('therapist', 'product', etc.)
 */
const reviewSchema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewed: {
    type: Schema.Types.ObjectId,
    ref: 'User', // or 'Therapist' or 'Product' if you want a more flexible system
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['therapist', 'product'],
    default: 'therapist',
  },
}, { timestamps: true });

export default model('Review', reviewSchema);
