// Each doctor is assigned a score based on experience, user ratings, and availability.
// lib/recommendation.js
export const calculateDoctorScore = (doctor) => {
  let score = 0;

  // Availability (mandatory)
  if (!doctor.available) return 0;

  // Experience-based scoring
  score += doctor.experience.length * 5;

  // Rating-based scoring (hybrid part)
  score += doctor.ratings.average * 10;
  score += doctor.ratings.count * 0.5;

  // Fee-based (optional, lower fees → slightly higher score)
  if (doctor.fees <= 500) score += 5;
  else if (doctor.fees <= 1000) score += 3;

  return score;
};
