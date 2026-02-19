import connectDB from "@/lib/db";
import doctorModel from "@/models/doctor";
import appointmentModel from "@/models/appointment";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { docId, userId, rating } = await req.json();

    if (!docId || !userId || !rating) {
      return NextResponse.json(
        { success: false, message: "docId, userId, and rating are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already rated this doctor via any completed appointment
    const alreadyRated = await appointmentModel.findOne({
      docId,
      userId,
      isCompleted: true,
      isRated: true, // new field to track per appointment rating
    });

    if (alreadyRated) {
      return NextResponse.json(
        { success: false, message: "You have already rated this doctor" },
        { status: 400 }
      );
    }

    // Update doctor's ratings
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Calculate new average
    const currentAverage = doctor.ratings?.average || 0;
    const currentCount = doctor.ratings?.count || 0;
    const newCount = currentCount + 1;
    const newAverage = (currentAverage * currentCount + rating) / newCount;

    doctor.ratings = {
      average: newAverage,
      count: newCount,
    };

    await doctor.save();

    // Mark appointment as rated
    await appointmentModel.updateMany(
      { docId, userId, isCompleted: true, ratingGiven: { $ne: true } },
      { $set: { isRated: true } }
    );

    return NextResponse.json({ success: true, message: "Rating submitted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to submit rating: " + error.message },
      { status: 500 }
    );
  }
};
