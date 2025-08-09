import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async(req)=>{
    try {
        const {email, password} = await req.json();

        //compare with env variables
        if(email == process.env.ADMIN_EMAIL || password == process.env.ADMIN_PASSWORD){

            //create admin details
            const adminData = {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                name: process.env.ADMIN_NAME
            }

            //create token
            const token = jwt.sign({email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET, {expiresIn: "3d"});

            const response = NextResponse.json({success:true, message: "Admin logged in successfully!!"}, {status: 200});

            //set cookie
            response.cookies.set("adminToken", token,{
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production",
                path: "/", 
                maxAge: 3 * 24 * 60 * 60 * 1000
            });

            return response;

        }else{
            return NextResponse.json({success:false, message: "Invalid credentials for admin!!"}, {status: 400});
        }
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to login admin" + error.message}, {status: 500});
    }
};