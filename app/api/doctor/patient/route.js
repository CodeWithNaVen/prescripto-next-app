import { NextResponse } from "next/server";
import { verifyDoctorToken } from "@/lib/authMiddleware";
import userModel from "@/models/user";
import appointmentModel from "@/models/appointment";
import connectDB from "@/lib/db";

export const GET = async (req) => {
  try {
    const doctor = verifyDoctorToken(req);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find all users who are patients
    let patients = await userModel
      .find({ role: "patient" })
      .select("name email phone images videoUrls");

    // Find all appointments for this doctor
    const appointments = await appointmentModel.find({ docId: doctor.id });

    // Extract patient IDs who have appointments
    const patientIds = appointments.map((appt) => appt.userId.toString());

    // Filter patients who DO have appointments with the doctor
    patients = patients.filter((patient) =>
      patientIds.includes(patient._id.toString())
    );

    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
