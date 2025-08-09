import connectDB from "@/lib/db";
import doctorModel from "@/models/doctor";
import { NextResponse } from "next/server";


export const GET = async () => {
    try {
        await connectDB();
        const doctors = await doctorModel.find({});

        if(doctors) {
            return NextResponse.json({success: true, message: "Doctors fetched successfully", doctors}, {status: 200});
        }
        
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to get doctors" + error.message}, {status: 500});
    }
};