import { verifyUserToken } from "@/lib/authMiddleware"
import connectDB from "@/lib/db";
import appointmentModel from "@/models/appointment";
import { NextResponse } from "next/server";

export const GET = async(req)=>{
    try {
        const user = verifyUserToken(req);
        if(!user) {
            throw new Error("User not authenticated ");
        }

        //connect to DB
        await connectDB();

        //find all appoint. for this user
        const appointments = await appointmentModel.find({userId: user.id});

        return NextResponse.json({success: true, message: "All appointments", appointments}, {status: 200});

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to get all appointments" + error.message}, {status: 500});
    }
}