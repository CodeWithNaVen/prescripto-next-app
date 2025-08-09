import { verifyUserToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctor";
import { NextResponse } from "next/server";


export const GET = async(req)=>{
    try {
        const admin = verifyUserToken(req);

        if(!admin) {
            throw new Error("User not authenticated ");
        }

        //connect to DB
        await connectDB();

        //find all doctors
        const doctors = await doctorModel.find({}).select("-password");

        return NextResponse.json({success: true, message: "All doctors", doctors}, {status: 200});
        
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to get all doctors" + error.message}, {status: 500});
    }
};