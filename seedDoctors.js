import mongoose from "mongoose";
import "dotenv/config";
import doctorModel from "./models/doctor.js";



const MONGO_URI = process.env.MONGO_URI;


const specialties = [
  "General Physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
  "Cardiologist",
  "Pulmonologist",
  "Orthopedist",
  "Rheumatologist",
  "Urologist",
  "Proctologist",
  "Phlebologist",
  "Ophthalmologist",
  "ENT Specialist",
  "Psychiatrist",
  "Hepatologist",
  "Nephrologist",
  "Infectious Disease Specialist",
  "Oncologist",
  "Allergist"
];

const generateDoctors = () => {
  return specialties.flatMap((specialty, i) =>
    Array.from({ length: 3 }).map((_, j) => ({
      name: `Dr. ${specialty} ${j + 1}`,
      email: `${specialty.toLowerCase().replace(/ /g, "")}${j}@nexcare.com`,
      password: "123456",

      doctorPic: `https://randomuser.me/api/portraits/men/${(i + j) % 90}.jpg`,
      speciality: specialty,
      degree: "MBBS, MD",

      experience: [
        {
          hospital: "Nepal Medical College",
          duration: `${Math.floor(Math.random() * 10) + 1} years`,
          position: "Consultant"
        }
      ],

      about: `Experienced ${specialty} with strong background in patient care.`,

      available: true,
      fees: Math.floor(Math.random() * 1000) + 500,

      address: {
        street: "Kathmandu",
        city: "Kathmandu",
        country: "Nepal"
      },

      date: Date.now(),
      slots_booked: {},

      ratings: {
        average: +(Math.random() * 5).toFixed(1),
        count: Math.floor(Math.random() * 100)
      }
    }))
  );
};

const seedDoctors = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const doctors = generateDoctors();

    let inserted = 0;
    let skipped = 0;

    for (const doc of doctors) {
      const exists = await doctorModel.findOne({ email: doc.email });

      if (!exists) {
        await doctorModel.create(doc);
        inserted++;
      } else {
        skipped++;
      }
    }

    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⚠️ Skipped (already exists): ${skipped}`);

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedDoctors();