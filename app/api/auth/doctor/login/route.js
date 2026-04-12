// app/api/auth/doctor/login/route.js
import doctorModel from "@/models/doctor";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";


export const POST = async(req)=>{
    try {
        const {email, password} = await req.json();

        //connect to DB
        await connectDB();

        //check if doctor exists
        const doctor = await doctorModel.findOne({email});
        if(!doctor){
            return NextResponse.json({success:false, message: "Doctor does not exist"}, {status: 400});
        }

        //compare password
        const isMatch = await bcrypt.compare(password, doctor.password);
        if(!isMatch){
            return NextResponse.json({success:false, message: "Invalid credentials"}, {status: 400});
        }

        //create token
        const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET, {expiresIn: "3d"});

        const response = NextResponse.json({success:true, message: "Doctor logged in successfully!!"}, {status: 200});

        //set cookie
        response.cookies.set("doctorToken", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            path: "/", 
            maxAge: 5 * 24 * 60 * 60 * 1000
        });

        return response;

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to login doctor"+ error.message}, {status: 500});   
    }
};