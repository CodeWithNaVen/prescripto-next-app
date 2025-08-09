import { verifyDoctorToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import appointmentModel from "@/models/appointment";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    // 1. Verify Token
    const doctor = verifyDoctorToken(req);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not authenticated" },
        { status: 401 }
      );
    }

    // 2. Connect DB
    await connectDB();

    // 3. Fetch appointments
    const appointments = await appointmentModel.find({ docId: doctor.id })
    
    return NextResponse.json( { success: true, message: "All appointments for doctor", appointments}, { status: 200 } );
  } catch (error) {
    return NextResponse.json( { success: false, message: "Failed to get all appointments for doctor: " + error.message}, { status: 500 } );
  }
};
