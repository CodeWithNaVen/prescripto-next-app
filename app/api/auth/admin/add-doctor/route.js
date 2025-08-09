import { verifyAdminToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctor";
import { uploadToCloudinary } from "@/utils/uploadMedia";

/**
 * POST endpoint to add a new doctor
 * Only accessible by authenticated admin users
 * Handles multipart/form-data for file uploads
 */
export const POST = async (req) => {
    try {
        // 1. AUTHENTICATION - Verify admin token
        const admin = verifyAdminToken(req);
        if (!admin) {
            throw new Error("Admin not authorized to add doctor");
        }

        // 2. PARSE FORM DATA - Extract all fields from multipart form
        const formData = await req.formData();

        // Extract basic doctor information
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const speciality = formData.get("speciality");
        const degree = formData.get("degree");
        const about = formData.get("about");
        const fees = formData.get("fees");
        
        // Extract JSON strings (will be parsed later)
        const experienceRaw = formData.get("experience"); // JSON string from frontend
        const addressRaw = formData.get("address"); // JSON string from frontend
        
        // Extract uploaded file
        const doctorPic = formData.get("doctorPic");

        // 3. FIELD VALIDATION - Check if all required fields are present
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experienceRaw ||
            !about ||
            !fees ||
            !addressRaw ||
            !doctorPic
        ) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        // 4. EMAIL VALIDATION - Ensure valid email format
        if (!validator.isEmail(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email address" },
                { status: 400 }
            );
        }

        // 5. PASSWORD VALIDATION (commented out - uncomment if you want strong password requirement)
        // if (!validator.isStrongPassword(password)) {
        //     return NextResponse.json(
        //         { success: false, message: "Password is not strong enough" },
        //         { status: 400 }
        //     );
        // }

        // 6. PARSE ADDRESS JSON - Convert JSON string back to object
        let address = {};
        try {
            address = JSON.parse(addressRaw);
            
            // Validate address structure - ensure all required fields are present
            if (!address.street || !address.city || !address.state || !address.zip) {
                return NextResponse.json(
                    { success: false, message: "Complete address information is required" },
                    { status: 400 }
                );
            }
        } catch {
            return NextResponse.json(
                { success: false, message: "Invalid address format" }, 
                { status: 400 }
            );
        }

        // 7. PARSE EXPERIENCE JSON - Convert JSON string back to array
        let experience = [];
        try {
            experience = JSON.parse(experienceRaw);
            
            // Validate experience structure
            if (!Array.isArray(experience)) {
                throw new Error("Experience must be an array");
            }
            
            // Validate each experience entry has required fields
            const hasValidExperience = experience.some(exp => exp.hospital && exp.duration);
            if (!hasValidExperience) {
                return NextResponse.json(
                    { success: false, message: "At least one complete experience entry is required" },
                    { status: 400 }
                );
            }
            
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Experience must be a valid JSON array with hospital and duration" },
                { status: 400 }
            );
        }

        // 8. DATABASE CONNECTION
        await connectDB();

        // 9. CHECK FOR EXISTING USER - Prevent duplicate emails
        const existingUser = await doctorModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "A user with this email already exists" },
                { status: 409 }
            );
        }

        // 10. PASSWORD HASHING - Secure password storage
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 11. IMAGE UPLOAD - Upload profile picture to Cloudinary
        let profileImageUrl = "";
        if (doctorPic && typeof doctorPic.name === "string") {
            try {
                const buffer = Buffer.from(await doctorPic.arrayBuffer());
                const uploaded = await uploadToCloudinary(buffer, "doctor-profile");
                profileImageUrl = uploaded.secure_url;
            } catch (uploadError) {
                return NextResponse.json(
                    { success: false, message: "Failed to upload profile image" },
                    { status: 500 }
                );
            }
        }

        // 12. CREATE DOCTOR RECORD - Save to database
        const newDoctor = await doctorModel.create({
            name,
            email,
            password: hashedPassword,
            role: "doctor", // Set role as doctor
            speciality,
            degree,
            experience, // Array of experience objects
            about,
            fees,
            address, // Complete address object
            doctorPic: profileImageUrl, // Cloudinary URL
            date: Date.now(), // Creation timestamp
        });

        // 13. SUCCESS RESPONSE - Return created doctor data (excluding password)
        const doctorResponse = { ...newDoctor.toObject() };
        delete doctorResponse.password; // Remove password from response

        return NextResponse.json({
            success: true,
            message: "Doctor added successfully",
            doctorData: doctorResponse,
        }, { status: 201 });

    } catch (error) {
        // 14. ERROR HANDLING - Log and return error response
        console.error("Add Doctor Error:", error.message);
        return NextResponse.json(
            { success: false, message: "Failed to add doctor: " + error.message },
            { status: 500 }
        );
    }
};