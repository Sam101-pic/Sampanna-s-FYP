import TherapistProfile from '../models/TherapistProfile.js';

const matchTherapist = async (userPreferences) => {
  const therapists = await TherapistProfile.find({});
  // Basic logic: match specialty and language
  const matched = therapists.filter((therapist) => {
    return (
      userPreferences.language === therapist.language &&
      therapist.specialties.includes(userPreferences.issueType)
    );
  });
  return matched.length ? matched : therapists;
};

export default matchTherapist;
