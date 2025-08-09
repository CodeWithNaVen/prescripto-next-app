import { NextResponse } from "next/server";
import userModel from "@/models/user";
import { verifyDoctorToken } from "@/lib/authMiddleware";

export const GET = async (req, { params }) => {
  try {
    const doctor = verifyDoctorToken(req);
    
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not authenticated" }, { status: 401 });
    }

    const patient = await userModel.findOne({ _id: params.id, role: "patient" }).select("-password");
    if (!patient) {
      return NextResponse.json({ success: false, message: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, patient });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
