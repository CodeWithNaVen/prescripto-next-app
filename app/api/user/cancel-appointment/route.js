import { verifyUserToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import appointmentModel from "@/models/appointment";
import doctorModel from "@/models/doctor";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        const user = verifyUserToken(req);
        const userId = user.id;

        if (!userId) {
        throw new Error("User not authenticated");
        }

        const { appointmentId } = await req.json();

        if (!appointmentId) {
        throw new Error("Missing appointment id");
        }

        await connectDB();

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return NextResponse.json({ success: false, message: "Appointment not found" },{ status: 404 });
        }

        // Check if the appointment has already been cancelled
        if (appointmentData.cancel) {
            return NextResponse.json({ success: false, message: "Appointment already cancelled" },{ status: 400 });
        }

        if (appointmentData.userId !== userId) {
        throw new Error("Unauthorized to cancel this appointment");
        }

        // Mark appointment as cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const docData = await doctorModel.findById(docId);

        if (docData) {
        let slots_booked = docData.slots_booked;

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(
            (time) => time !== slotTime
            );

            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }
        }

        return NextResponse.json(
        { success: true, message: "Appointment cancelled successfully" },
        { status: 200 }
        );
    } catch (error) {
        console.log("Cancel Error:", error.message);
        return NextResponse.json(
        { success: false, message: "Failed to cancel appointment: " + error.message },
        { status: 500 }
        );
    }
};
