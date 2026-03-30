import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import userModel from "@/models/user";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
    try {
        const { email, otp, newPassword } = await req.json();

        console.log("Email:", email);
        console.log("OTP:", otp);
        console.log("New Password:", newPassword);

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        await connectDB();
        const user = await userModel.findOne({ email });

        if (!user || user.resetOtp === "" || user.resetOtp !== otp) {
            return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return NextResponse.json({ success: false, message: "OTP Expired" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        
        // Clear OTP fields
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();

        return NextResponse.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};