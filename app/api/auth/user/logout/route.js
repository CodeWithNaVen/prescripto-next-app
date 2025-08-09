import { verifyUserToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export const GET = async(req) => {
    try {
        const user = verifyUserToken(req);
        if(!user) {
            throw new Error("User not authenticated ");
        }

        const response = NextResponse.json({success: true, message: "User logged out successfully"}, {status: 200});

        //clear the cookie
        response.cookies.set("userToken", "", {
            httpOnly:true,
            expires: new Date(0),
            path: "/",
        });

        return response;

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to logout user" + error.message}, {status: 500});
    }
}