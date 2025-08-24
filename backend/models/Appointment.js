// models/Appointment.js
import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  therapistId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  datetime: {
    type: Date,
    required: true, // Always store in UTC
  },
  durationMin: {
    type: Number,
    min: 15,
    max: 180,
    default: 50,
  },
  type: {
    type: String,
    enum: ['video', 'text'],
    default: 'video',
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
    required: true,
  },
  meetingUrl: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// helpful indexes for fast lookups
appointmentSchema.index({ patientId: 1, datetime: 1 });
appointmentSchema.index({ therapistId: 1, datetime: 1 });

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;
