import { verifyAdminToken } from "@/lib/authMiddleware";
import appointmentModel from "@/models/appointment"
import { NextResponse } from "next/server";


export const GET = async(req)=>{
    try {
        const admin = verifyAdminToken(req);
        if(!admin) {
            throw new Error("Admin not authenticated ");
        }

        const appointments = await appointmentModel.find({});

        return NextResponse.json({success: true, message: "All appointments for admin", appointments}, {status: 200});
    } catch (error) {
        return NextResponse.json({success:false, message: "Failed to get all appointments for admin" + error.message}, {status: 500});
    }
}