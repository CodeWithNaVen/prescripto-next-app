import { verifyUserToken } from "@/lib/authMiddleware";
import connectDB from "@/lib/db";
import userModel from "@/models/user";
import { NextResponse } from "next/server";


export const GET = async(req)=>{
    try {
        const user = verifyUserToken(req);
        const userId = user.id;

        //connect to DB
        await connectDB();

        //prepare userDate without password
        const userData = await userModel.findById(userId).select("-password");

        if(!userData){
            return NextResponse.json({success:false, message: "User does not exist"}, {status: 400});
        }

        return NextResponse
        .json({success:true, message: "User profile Info", userData}, {status: 200});


    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to get user profile Info" + error.message}, {status: 500});
        
    }
};