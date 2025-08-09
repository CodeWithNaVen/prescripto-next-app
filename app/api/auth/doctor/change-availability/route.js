import { verifyDoctorToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctor";
import { NextResponse } from "next/server";

// doctor is changing availability
export const PUT = async(req)=>{
    try {
        // get the doctor id
        const {doctorId} = await req.json();
        if(!doctorId) {
            throw new Error("Missing doctor id");
        }

        // check if doctor exists
        const doctor = await doctorModel.findById(doctorId);
        if(!doctor) {
            throw new Error("Doctor does not exist");
        }

        // check if admin
        const admin = verifyDoctorToken(req);
        if(!admin) {
            throw new Error("Admin not authenticated");
        }

        //change availability
        await connectDB();
        await doctorModel.findByIdAndUpdate(doctorId, {available: !doctor.available});

        return NextResponse.json({success: true, message: "Availability changed successfully"}, {status: 200});

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to change availability" + error.message}, {status: 500});
    }
};