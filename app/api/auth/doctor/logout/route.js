import { verifyDoctorToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export const GET = async(req) => {
    try {
        const doctor = verifyDoctorToken(req);
        if(!doctor) {
            throw new Error("Admin not authenticated ");
        }
        
        const response = NextResponse.json({success:true, message: "Doctor logged out successfully"}, {status: 200});

        //clear the cookie
        response.cookies.set("doctorToken", "", {
            httpOnly:true,
            expires: new Date(0),
            path: "/",
        });

        return response;

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to logout doctor" + error.message}, {status: 500});
    }
}