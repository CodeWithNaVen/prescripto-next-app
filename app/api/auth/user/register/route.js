import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "@/models/user";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
    try {
        const {name, email, password} = await req.json();

        if(!name || !email || !password){
            return NextResponse.json({success:false, message: "All fields are required"}, {status: 400});
        }

        //validate the email
        if(!validator.isEmail(email)){
            return NextResponse.json({success:false, message: "Invalid email address"}, {status: 400});
        }

        //validate password
        // if(!validator.isStrongPassword(password)){
        //     return NextResponse.json({success:false, message: "Password is not strong enough"}, {status: 400});
        // }

        if(password.length < 6){
            return res.json({success: false, message:"Enter a strong password"});
        }

        //connect to DB
        await connectDB();

        //check if user already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return NextResponse.json({success:false, message: "User already exists"}, {status: 400});
        }

        //encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create the user
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        //create a token to authorize the user
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: "3d"
        })

        //prepare user data to create
        const userWithoutPassword = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        //put the user in the response
        const response = NextResponse.json({success: true, message: "User created successfully", user: userWithoutPassword}, {status: 201});

        //set the cookie via httpOnly
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
        return NextResponse.json({success:false, message: "Failed to Register User!!"}, {status: 500});
    }
} 