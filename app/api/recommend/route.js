import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctor";

// Map Python's disease names to your Doctor specialties
const diseaseToSpecialty = {
    "Fungal infection": "Dermatologist",
    "Allergy": "Allergist",
    "GERD": "Gastroenterologist",
    "Chronic cholestasis": "Gastroenterologist",
    "Drug Reaction": "Allergist",
    "Peptic ulcer diseae": "Gastroenterologist",
    "AIDS": "Infectious Disease Specialist",
    "Diabetes": "Endocrinologist",
    "Gastroenteritis": "Gastroenterologist",
    "Bronchial Asthma": "Pulmonologist",
    "Hypertension": "Cardiologist",
    "Migraine": "Neurologist",
    "Cervical spondylosis": "Orthopedist",
    "Paralysis (brain hemorrhage)": "Neurologist",
    "Jaundice": "Gastroenterologist",
    "Malaria": "Infectious Disease Specialist",
    "Chicken pox": "Infectious Disease Specialist",
    "Dengue": "Infectious Disease Specialist",
    "Typhoid": "Infectious Disease Specialist",
    "hepatitis A": "Gastroenterologist",
    "Hepatitis B": "Gastroenterologist",
    "Hepatitis C": "Gastroenterologist",
    "Hepatitis D": "Gastroenterologist",
    "Hepatitis E": "Gastroenterologist",
    "Alcoholic hepatitis": "Gastroenterologist",
    "Tuberculosis": "Pulmonologist",
    "Common Cold": "General Physician",
    "Pneumonia": "Pulmonologist",
    "Dimorphic hemmorhoids(piles)": "Proctologist",
    "Heart attack": "Cardiologist",
    "Varicose veins": "Phlebologist",
    "Hypothyroidism": "Endocrinologist",
    "Hyperthyroidism": "Endocrinologist",
    "Hypoglycemia": "Endocrinologist",
    "Osteoarthristis": "Orthopedist",
    "Arthritis": "Rheumatologist",
    "(vertigo) Paroymsal  Positional Vertigo": "Neurologist",
    "Acne": "Dermatologist",
    "Urinary tract infection": "Urologist",
    "Psoriasis": "Dermatologist",
    "Impetigo": "Dermatologist"
};

export async function POST(req) {
    try {
        const { symptoms } = await req.json(); // symptoms: ["itching", "skin_rash"]
        await connectDB();

        console.log("⭐⭐⭐", symptoms);
        

        // 1. Send request to your LOCAL Python server
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms })
        });

        
        if (!response.ok) throw new Error("Python server is not responding");
        
        const pythonData = await response.json();
        const predictedDisease = pythonData.disease;
        
        console.log("⭐⛔⛔", pythonData);
        // 2. Determine specialty
        const specialty = diseaseToSpecialty[predictedDisease] || "General Physician";

        // 3. Find doctors in your MongoDB matching this specialty
        const doctors = await doctorModel.find({ speciality: specialty, available: true }).lean();

        // 4. Simple ranking (Score = Rating + Experience)
        const rankedDoctors = doctors.map(doc => ({
            ...doc,
            recommendationScore: (doc.ratings.average * 10) + (doc.experience.length * 2)
        })).sort((a, b) => b.recommendationScore - a.recommendationScore);

        console.log("⛔⛔", predictedDisease, specialty, rankedDoctors);

        return NextResponse.json({
            success: true,
            disease: predictedDisease,
            specialty: specialty,
            recommendations: rankedDoctors
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}