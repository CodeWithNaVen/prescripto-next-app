import { verifyAdminToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export const GET = async(req) => {
    try {
        const admin = verifyAdminToken(req);
        if(!admin) {
            throw new Error("Admin not authenticated ");
        }
        
        const response = NextResponse.json({success: true, message: "Admin logged out successfully"}, {status: 200});

        //clear the cookie
        response.cookies.set("adminToken", "", {
            httpOnly:true,
            expires: new Date(0),
            path: "/",
        });

        return response;

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to logout admin" + error.message}, {status: 500});
    }
}