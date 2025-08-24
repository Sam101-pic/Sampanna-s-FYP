// backend/utils/availability.util.js

/**
 * Generate availability slots for a therapist
 * @param {Object} options
 * @param {string} options.therapistId - Therapist's userId
 * @param {string} [options.startDate] - Start date (YYYY-MM-DD)
 * @param {number} [options.days=7] - Number of days to generate
 * @param {number[]} [options.workDays=[1,2,3,4,5]] - Days of week (0=Sunday)
 * @param {string} [options.startHour="09:00"] - Working hours start
 * @param {string} [options.endHour="17:00"] - Working hours end
 * @param {number} [options.slotMinutes=60] - Slot duration in minutes
 * @returns {Array} List of availability slots
 */
export async function generateAvailability({
  therapistId,
  startDate,
  days = 7,
  workDays = [1, 2, 3, 4, 5], // default: Mon–Fri
  startHour = "09:00",
  endHour = "17:00",
  slotMinutes = 60,
}) {
  const slots = [];
  const start = startDate ? new Date(startDate) : new Date();

  for (let i = 0; i < days; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);

    const weekday = day.getDay();
    if (!workDays.includes(weekday)) continue; // skip non-working days

    // working hours
    const [sh, sm] = startHour.split(":").map(Number);
    const [eh, em] = endHour.split(":").map(Number);
    const startTime = new Date(day.setHours(sh, sm, 0, 0));
    const endTime = new Date(day.setHours(eh, em, 0, 0));

    for (let t = new Date(startTime); t < endTime; t.setMinutes(t.getMinutes() + slotMinutes)) {
      slots.push({
        therapistId,
        date: new Date(t), // exact slot time
        isAvailable: true,
      });
    }
  }

  return slots;
}
