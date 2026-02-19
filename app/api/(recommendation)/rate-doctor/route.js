import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import appointmentModel from "@/models/appointment";
import doctorModel from "@/models/doctor";
import { verifyUserToken } from "@/lib/authMiddleware";

export const POST = async (req) => {
  try {
    // 1️⃣ Verify patient
    const user = verifyUserToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { appointmentId, rating } = await req.json();

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await connectDB();

    // 2️⃣ Fetch appointment
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Ownership check
    if (appointment.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized rating attempt" },
        { status: 403 }
      );
    }

    // 4️⃣ Business rules
    if (!appointment.isCompleted) {
      return NextResponse.json(
        { success: false, message: "Appointment not completed yet" },
        { status: 400 }
      );
    }

    if (appointment.isRated) {
      return NextResponse.json(
        { success: false, message: "Doctor already rated for this appointment" },
        { status: 400 }
      );
    }

    // 5️⃣ Update doctor rating
    const doctor = await doctorModel.findById(appointment.docId);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    const newCount = doctor.ratings.count + 1;
    const newAverage =
      (doctor.ratings.average * doctor.ratings.count + rating) / newCount;

    doctor.ratings.count = newCount;
    doctor.ratings.average = newAverage;

    await doctor.save();

    // 6️⃣ Mark appointment as rated
    appointment.isRated = true;
    appointment.rating = rating;
    await appointment.save();

    return NextResponse.json(
      {
        success: true,
        message: "Rating submitted successfully",
        averageRating: doctor.ratings.average
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
