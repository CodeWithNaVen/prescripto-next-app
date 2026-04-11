// app/api/recommend/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctor";

const PYTHON_API = process.env.PYTHON_API_URL;

// Disease → Specialty Mapping
const diseaseToSpecialty = {
  "Fungal Infection": "Dermatologist",
  "Allergy": "Dermatologist",
  "GERD": "Gastroenterologist",
  "Chronic Cholestasis": "Gastroenterologist",
  "Drug Reaction": "Dermatologist",
  "Peptic Ulcer Disease": "Gastroenterologist",
  "AIDS": "Infectious Disease Specialist",
  "Diabetes": "Endocrinologist",
  "Gastroenteritis": "Gastroenterologist",
  "Bronchial Asthma": "Pulmonologist",
  "Hypertension": "Cardiologist",
  "Migraine": "Neurologist",
  "Cervical Spondylosis": "Orthopedist",
  "Paralysis (Brain Hemorrhage)": "Neurologist",
  "Jaundice": "Gastroenterologist",
  "Malaria": "Infectious Disease Specialist",
  "Chicken Pox": "Infectious Disease Specialist",
  "Dengue": "Infectious Disease Specialist",
  "Typhoid": "Infectious Disease Specialist",
  "Hepatitis A": "Gastroenterologist",
  "Hepatitis B": "Gastroenterologist",
  "Hepatitis C": "Gastroenterologist",
  "Hepatitis D": "Gastroenterologist",
  "Hepatitis E": "Gastroenterologist",
  "Alcoholic Hepatitis": "Gastroenterologist",
  "Tuberculosis": "Pulmonologist",
  "Common Cold": "General Physician",
  "Pneumonia": "Pulmonologist",
  "Hemorrhoids (Piles)": "Proctologist",
  "Heart Attack": "Cardiologist",
  "Varicose Veins": "Vascular Specialist",
  "Hypothyroidism": "Endocrinologist",
  "Hyperthyroidism": "Endocrinologist",
  "Hypoglycemia": "Endocrinologist",
  "Osteoarthritis": "Orthopedist",
  "Arthritis": "Rheumatologist",
  "Vertigo (Paroxysmal Positional Vertigo)": "Neurologist",
  "Acne": "Dermatologist",
  "Urinary Tract Infection": "Urologist",
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