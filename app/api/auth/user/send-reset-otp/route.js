import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import userModel from "@/models/user";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req) => {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        await connectDB();
        const user = await userModel.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set expiry for 15 minutes
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Send Email via Resend
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Use your verified domain in production
            to: email,
            subject: 'Password Reset OTP',
            html: `<h1>Reset Your Password</h1>
                   <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                   <p>This OTP will expire in 15 minutes.</p>`
        });

        return NextResponse.json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};