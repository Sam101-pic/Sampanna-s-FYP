// backend/services/availability.js
import { find } from '../models/Appointment';
import { findOne } from '../models/TherapistProfile';
import { isValidObjectId, Types } from 'mongoose';

function atStartOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function addDays(d, n)   { const x = new Date(d); x.setDate(x.getDate()+n); return x; }

/**
 * Generate availability slots forward from startDate for N days.
 * Returns [{ startTime: ISOString, endTime: ISOString }]
 */
async function generateAvailability({ therapistId, startDate, days = 7 }) {
  const start = atStartOfDay(startDate ? new Date(startDate) : new Date());
  const end   = addDays(start, days);

  // Therapist preferences (with sensible defaults)
  const prof = await findOne({ userId: therapistId })
    .select('workDays startHour endHour slotMinutes')
    .lean();

  const workDays = Array.isArray(prof?.workDays) && prof.workDays.length ? prof.workDays : [1,2,3,4,5]; // Mon–Fri
  const startHour = Number.isFinite(prof?.startHour)   ? prof.startHour   : 10; // 10:00
  const endHour   = Number.isFinite(prof?.endHour)     ? prof.endHour     : 17; // 17:00
  const slotMin   = Number.isFinite(prof?.slotMinutes) ? prof.slotMinutes : 50;

  const oid = isValidObjectId(therapistId) ? new Types.ObjectId(therapistId) : therapistId;

  const appts = await find({
    $or: [{ therapist: oid }, { therapistId: oid }],
    datetime: { $gte: start, $lt: end },
    $or: [{ status: { $exists: false } }, { status: { $in: ['scheduled', 'pending', 'confirmed'] } }]
  })
  .select('datetime durationMinutes durationMin status')
  .lean();

  const taken = appts.map(a => {
    const from = new Date(a.datetime).getTime();
    const dur  = Number.isFinite(a?.durationMinutes) ? a.durationMinutes
               : Number.isFinite(a?.durationMin)     ? a.durationMin
               : slotMin;
    const to = from + dur * 60_000;
    return { from, to };
  });

  const slots = [];
  const cur = new Date(start);
  const now = new Date();

  while (cur < end) {
    const day = cur.getDay(); // 0..6
    if (workDays.includes(day)) {
      for (let h = startHour; h < endHour; ) {
        const slotStart = new Date(cur);
        slotStart.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0);
        const slotEnd = new Date(slotStart.getTime() + slotMin * 60_000);
        h += slotMin / 60;

        if (slotStart < now) continue;

        const s = slotStart.getTime(), e = slotEnd.getTime();
        const overlaps = taken.some(t => s < t.to && e > t.from);
        if (!overlaps) slots.push({ startTime: slotStart.toISOString(), endTime: slotEnd.toISOString() });
      }
    }
    cur.setDate(cur.getDate() + 1);
    cur.setHours(0,0,0,0);
  }

  return slots;
}

export default { generateAvailability };
