import { NextResponse } from "next/server";  
import connectDB from "@/lib/db";
import userModel from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const POST = async(req) => {
    try {
        const {email, password} = await req.json();
        
        if(!email || !password){
            return NextResponse.json({success:false, message: "All fields are required"}, {status: 400});
        }

        //connect to DB
        await connectDB();

        //get user to compare
        const user = await userModel.findOne({email});
        if(!user){
            return NextResponse.json({success:false, message: "User does not exist"}, {status: 400});
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return NextResponse.json({success:false, message: "Invalid credentials"}, {status: 400});
        }

        //create token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});

        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }

        const response = NextResponse.json({success: true, message: "User logged in successfully!!", user: userWithoutPassword});

        //set cookie 
        response.cookies.set("userToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 5 * 24 * 60 * 60 * 1000
        });
        return response;


    } catch (error) {
        console.error(error.message);
        return NextResponse.json({success:false, message: "Failed to log in User!!"}, {status: 500});
    }
};