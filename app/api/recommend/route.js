import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctor";

const PYTHON_API = process.env.PYTHON_API_URL;

// Disease → Specialty Mapping
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
    const { symptoms } = await req.json();

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { success: false, message: "Invalid symptoms input" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔥 Call Python API
    const response = await fetch(`${PYTHON_API}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ symptoms })
    });

    if (!response.ok) {
      throw new Error("Python API failed");
    }

    const pythonData = await response.json();

    const topPredictions = pythonData.top_predictions;

    let allDoctors = [];

    // 🔥 Get doctors for each prediction
    for (const pred of topPredictions) {
      const specialty =
        diseaseToSpecialty[pred.disease] || "General Physician";

      const doctors = await doctorModel
        .find({ speciality: specialty, available: true })
        .lean();

      const scoredDoctors = doctors.map(doc => ({
        ...doc,
        predictedDisease: pred.disease,
        confidence: pred.confidence,

        // 🔥 Improved Ranking Formula
        recommendationScore:
          (doc.ratings?.average || 0) * 20 +
          (doc.experienceYears || 0) * 5 +
          (doc.totalPatients || 0) * 2 +
          (pred.confidence * 50) // ML weight
      }));

      allDoctors.push(...scoredDoctors);
    }

    // 🔥 Sort & Deduplicate
    const uniqueDoctors = Object.values(
      allDoctors.reduce((acc, doc) => {
        if (
          !acc[doc._id] ||
          acc[doc._id].recommendationScore < doc.recommendationScore
        ) {
          acc[doc._id] = doc;
        }
        return acc;
      }, {})
    );

    const rankedDoctors = uniqueDoctors.sort(
      (a, b) => b.recommendationScore - a.recommendationScore
    );

    return NextResponse.json({
      success: true,
      predictions: topPredictions,
      recommendations: rankedDoctors.slice(0, 10),
      ignoredSymptoms: pythonData.ignored_symptoms
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}