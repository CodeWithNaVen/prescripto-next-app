// app/api/(recommendation)/recommend-doctors/route.js
import connectDB from "@/lib/db";
import { calculateDoctorScore } from "@/lib/recommendation";
import doctorModel from "@/models/doctor";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const speciality = searchParams.get("speciality");

    if (!speciality) {
      return NextResponse.json(
        { success: false, message: "Speciality is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch doctors by speciality
    const doctors = await doctorModel.find({
      speciality,
      available: true
    });

    // 2️⃣ Score each doctor
    const rankedDoctors = doctors
      .map((doctor) => ({
        doctor,
        score: calculateDoctorScore(doctor)
      }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.doctor);

    return NextResponse.json(
      {
        success: true,
        message: "Recommended doctors fetched successfully",
        doctors: rankedDoctors
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
