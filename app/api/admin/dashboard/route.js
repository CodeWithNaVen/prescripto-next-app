import { verifyAdminToken } from "@/lib/authMiddleware";
import appointmentModel from "@/models/appointment";
import doctorModel from "@/models/doctor";
import userModel from "@/models/user";
import { NextResponse } from "next/server";

export const GET = async(req)=>{
    try {
        const admin = verifyAdminToken(req);
        if(!admin) {
            throw new Error("Admin not authenticated ");
        }

        //find all user, doctors and appointments
        const users = await userModel.find({});
        const doctors = await doctorModel.find({});
        const appointments = await appointmentModel.find({});

        const dashData = {
            totalPatients: users.length,
            totalDoctors: doctors.length,
            totalAppointments: appointments.length,
            latestAppointments: appointments.slice(0, 5).reverse()
        }

        return NextResponse.json({success: true, message: "Dashboard data", dashData}, {status: 200});
        
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to get dashboard data" + error.message}, {status: 500});
    }
}