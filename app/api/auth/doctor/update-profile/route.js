// File: /app/api/doctor/update-profile/route.js  (or .ts)

import { NextResponse } from "next/server";
import doctorModel from "@/models/doctor";
import connectDB from "@/lib/db";
import { verifyDoctorToken } from "@/lib/authMiddleware";

export async function PUT(req) {
  try {
    await connectDB();

    // Verify doctor token and get doctor info
    const doctor = verifyDoctorToken(req);
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Parse incoming JSON body
    const body = await req.json();

    const {
      name,
      about,
      fees,
      available,
      address, // object with street, city, state, zip
      experience, // array of experience objects
    } = body;

    // Validate / sanitize fields as needed (optional)

    // Update doctor profile
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      doctor.id,
      {
        ...(name !== undefined && { name }),
        ...(about !== undefined && { about }),
        ...(fees !== undefined && { fees }),
        ...(available !== undefined && { available }),
        ...(address !== undefined && { address }),
        ...(experience !== undefined && { experience }),
      },
      { new: true } // Return the updated document
    );

    if (!updatedDoctor) {
      return NextResponse.json({ success: false, message: "Doctor not Updated" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Doctor profile updated successfully",
      updatedDoctor,
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
