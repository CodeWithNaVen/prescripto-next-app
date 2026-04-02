import connectDB from "@/lib/db";
import appointmentModel from "@/models/appointment";
import doctorModel from "@/models/doctor";
import userModel from "@/models/user";
import { NextResponse } from "next/server";

export const POST = async(req)=>{
    try {
        const {userId, docId, slotDate, slotTime} = await req.json();

        if(!userId || !docId || !slotDate || !slotTime) {
            return NextResponse.json({success:false, message: "Missing required fields for appointment"}, {status: 400});
        }

        //connect to DB
        await connectDB();

        const docData = await doctorModel.findById(docId).select("-password");
        if(!docData) {
            return NextResponse.json({success:false, message: "Doctor does not exist"}, {status: 400});
        }


        //check the doctor is available or not
        if(!docData.available) {
            return NextResponse.json({success:false, message: "Doctor is not available"}, {status: 400});
        }

        //check if the slot is alrady booked or not
        const slots_booked = docData.slots_booked || {};
        //check of slot booked on the date
        if(slots_booked[slotDate]){
            //check the time
            if(slots_booked[slotDate].includes(slotTime)){
                return NextResponse.json({success:false, message: "Slot already booked, please choose another slot"}, {status: 400});
            }else{
                // append new time slot
                slots_booked[slotDate].push(slotTime);
            }
           
        }else{
            // new date, create time array
            slots_booked[slotDate] = [slotTime];
        }

        //get the user data
        const userData = await userModel.findById(userId).select("-password");
        //remove the history of slot booked
        delete docData.slots_booked;

        const appointmentData = {
            userId, docId, userData, docData, slotDate, slotTime,
            amount:docData.fees, date: Date.now()
        }

        //save the appointment
        const newAppointment = await appointmentModel.create(appointmentData);

        //update the slots date now(free slots after booking)
        await doctorModel.findByIdAndUpdate(docId, {slots_booked});
        
        return NextResponse.json({success:true, message: "Appointment booked successfully", appointment: newAppointment}, {status: 200});

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({success:false, message: "Failed to book appointment" + error.message}, {status: 500});
    }
}