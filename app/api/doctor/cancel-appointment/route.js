import { verifyDoctorToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import appointmentModel from "@/models/appointment";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        // get the doctor id
        const doctor = verifyDoctorToken(req);
        const doctorId = doctor.id;

        if (!doctorId) {
            throw new Error("Doctor not authenticated");
        }

        // get the appointment id
        const { appointmentId } = await req.json();
        if (!appointmentId) {
            throw new Error("Missing appointment id");
        }

        // connect to DB
        await connectDB();

        // find the appointment and cancel
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 });
        }

        // check if the appointment has already been cancelled
        if (appointmentData.cancel) {
            return NextResponse.json({ success: false, message: "Appointment already cancelled" }, { status: 400 });
        }

        // check if the doctor is authorized
        if (appointmentData.docId !== doctorId) {
            throw new Error("Unauthorized doctor to cancel this appointment");
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true });

        return NextResponse.json({ success: true, message: "Appointment cancelled by doctor" }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ success: false, message: "Failed to cancel appointment: " + error.message }, { status: 500 });
    }
};
