import { verifyDoctorToken } from "@/lib/authMiddleware";
import appointmentModel from "@/models/appointment";
import { NextResponse } from "next/server";

/**
    latestAppointments, totalAppointments, earnings, patients
 */
export const GET = async(req)=>{
    try {
        const doctor = verifyDoctorToken(req);

        if(!doctor) {
            throw new Error("Doctor not authenticated");
        }

        const appointments = await appointmentModel.find({docId: doctor.id});

        //calculate earning
        let totalEarnings = 0;
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                totalEarnings += item.amount;
            }
        })

        //calculate no.of patients
        let patients = [];
        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId);
            }
        })

        const dashData = {
            latestAppointments: appointments.reverse().slice(0, 5),
            totalAppointments: appointments.length,
            totalEarnings,
            totalPatients: patients.length
        }

        return NextResponse.json({success: true, message: "Dashboard data", dashData}, {status: 200});
        
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to get doctor dashboard data" + error.message}, {status: 500});
    }
}