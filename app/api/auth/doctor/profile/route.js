import { verifyDoctorToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctor";
import { NextResponse } from "next/server";


export const GET = async(req)=>{
    try {
        const doctor = verifyDoctorToken(req);
        if(!doctor) {
            throw new Error("Doctor not authenticated");
        }

        await connectDB();

        const doctorProfile = await doctorModel.findById(doctor.id).select("-password");

        return NextResponse.json({success: true, message: "Doctor profile fetched successfully", doctorData: doctorProfile}, {status: 200});
        
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to get doctor profile" + error.message}, {status: 500});
    }
};