import doctorModel from "@/models/doctor";
import appointmentModel from "@/models/appointment";

export const getRecommendations = async (userId) => {
    // 1. Fetch User Data & History
    const userAppointments = await appointmentModel.find({ userId, isCompleted: true });
    
    // Extract preferred specialties based on history
    const historySpecialties = userAppointments.map(app => app.docData.speciality);
    const favoriteDocIds = userAppointments.filter(app => app.rating >= 4).map(app => app.docId);

    // 2. Fetch all available doctors
    const doctors = await doctorModel.find({ available: true });

    // 3. Calculate Scores
    const scoredDoctors = doctors.map(doctor => {
        let score = 0;

        // A. Specialty Match (High Weight)
        if (historySpecialties.includes(doctor.speciality)) {
            score += 40;
        }

        // B. Experience Scoring
        // Logic: More hospitals/longer duration = higher score (capped at 20)
        const expYears = doctor.experience.length * 5; 
        score += Math.min(expYears, 20);

        // C. Bayesian Rating Score
        // Formula: (v*R + m*C) / (v+m)
        // v = count, R = average, m = min reviews (e.g. 5), C = mean rating across site (e.g. 3)
        const v = doctor.ratings.count;
        const R = doctor.ratings.average;
        const m = 2; // minimum reviews to be "trusted"
        const C = 3.5; // global average
        const bayesianRating = (v * R + m * C) / (v + m);
        score += (bayesianRating / 5) * 20;

        // D. Affordability
        // Doctors with lower fees get a slight boost in "General" recommendations
        if (doctor.fees < 500) score += 10;
        else if (doctor.fees < 1000) score += 5;

        // E. Return User Bonus
        if (favoriteDocIds.includes(doctor._id.toString())) {
            score += 15;
        }

        return { ...doctor._doc, recommendationScore: score };
    });

    // 4. Sort by score descending
    return scoredDoctors.sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, 10);
};