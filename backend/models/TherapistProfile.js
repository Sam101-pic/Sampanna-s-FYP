import { Schema, model } from 'mongoose';

const TherapistProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // each therapist has one profile
    },
    license:        { type: String, trim: true, default: '' },
    specialization: { type: String, trim: true, default: '' },
    bio:            { type: String, trim: true, default: '' },
    experience:     { type: String, trim: true, default: '' }, // e.g. "5 years"
    qualifications: { type: String, trim: true, default: '' },
    languages: {
      type: [String],
      default: ['English'],
      set: (arr) =>
        Array.from(new Set((arr || [])
          .map(s => String(s).trim())
          .filter(Boolean))),
    },
    fee:       { type: Number, min: 0, default: 0 },
    location:  { type: String, trim: true, default: '' },
    avatarUrl: { type: String, trim: true, default: '' },
    workDays: {
      type: [Number], // 0=Sun .. 6=Sat
      default: [1, 2, 3, 4, 5],
      validate: {
        validator: (v) =>
          Array.isArray(v) &&
          v.length > 0 &&
          v.every(d => Number.isInteger(d) && d >= 0 && d <= 6),
        message: 'workDays must be integers between 0 and 6',
      },
    },
    startHour:   { type: Number, min: 0,  max: 23, default: 10 },
    endHour:     { type: Number, min: 1,  max: 24, default: 17 },
    slotMinutes: { type: Number, min: 15, max: 180, default: 50 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TherapistProfileSchema.pre('validate', function (next) {
  if (this.startHour >= this.endHour) {
    this.invalidate('endHour', 'endHour must be greater than startHour');
  }
  next();
});

export default model('TherapistProfile', TherapistProfileSchema);
