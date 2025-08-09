import { verifyDoctorToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import appointmentModel from "@/models/appointment";
import { NextResponse } from "next/server";


export const POST = async(req)=>{
    try {
        const doctor = verifyDoctorToken(req);
        if(!doctor) {
            throw new Error("Doctor not authenticated");
        }

        const {appointmentId} = await req.json();
        if(!appointmentId) {
            throw new Error("Missing appointment id");
        }

        await connectDB();
        
        const appointmentData = await appointmentModel.findById(appointmentId);
        

        if(appointmentData && appointmentData.docId === doctor.id) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true});
            
            return NextResponse.json({success: true, message: "Appointment completed successfully"}, {status: 200});
        }else{
            throw new Error("Unauthorized to complete this appointment");
        }
        
    } catch (error) {
        return NextResponse.json({success: false, message: "Failed to complete appointment" + error.message}, {status: 500});
    }
    
}