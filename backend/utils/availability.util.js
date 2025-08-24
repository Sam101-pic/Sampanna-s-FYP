import TherapistProfile from "../models/TherapistProfile.js";

/**
 * Generate availability slots for a therapist
 * 
 * @param {Object} options
 * @param {string} options.therapistId - Therapist's userId (MongoId)
 * @param {string} [options.startDate] - Start date (YYYY-MM-DD)
 * @param {number} [options.days=7] - Number of days to generate
 * @returns {Array} List of availability slots
 */
export async function generateAvailability({
  therapistId,
  startDate,
  days = 7,
}) {
  // 🔹 Fetch therapist profile (hours, workDays, slot length)
  const profile = await TherapistProfile.findOne({ userId: therapistId }).lean();
  if (!profile) return [];

  const {
    workDays = [1, 2, 3, 4, 5],  // Mon–Fri
    startHour = 9,
    endHour = 17,
    slotMinutes = 50,
  } = profile;

  const slots = [];
  const start = startDate ? new Date(startDate) : new Date();

  for (let i = 0; i < days; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);

    const weekday = day.getDay();
    if (!workDays.includes(weekday)) continue; // skip weekends/non-workdays

    const startTime = new Date(day);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(day);
    endTime.setHours(endHour, 0, 0, 0);

    for (let t = new Date(startTime); t < endTime; t.setMinutes(t.getMinutes() + slotMinutes)) {
      slots.push({
        therapistId,
        date: new Date(t),   // exact slot time
        isAvailable: true,
      });
    }
  }

  return slots;
}
