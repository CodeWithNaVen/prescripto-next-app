import connectDB from '@/lib/db';
import Appointment from '@/models/aiAppointment';
import appointmentModel from '@/models/appointment';
import doctorModel from '@/models/doctor';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const doctorFilter = searchParams.get('doctor');
    
    const query = doctorFilter ? { doctorName: doctorFilter } : {};
    
    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 }) // Sort by newest log first
      .lean();
    
    const formattedAppointments = appointments.map(appt => ({
      id: appt._id.toString(),
      patientName: appt.patientName,
      doctorName: appt.doctorName,
      slotDate: appt.slotDate, // Map to new field
      slotTime: appt.slotTime, // Map to new field
      symptom: appt.symptom,
      status: appt.status,
    }));

    return NextResponse.json({ success: true, appointments: formattedAppointments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    let body;
    try { body = await request.json(); } catch (e) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }
    
    const { patientName, age, docId, slotDate, slotTime, symptom, userId } = body;

    if (!patientName || !docId || !slotDate || !slotTime || !symptom) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const doctor = await doctorModel.findById(docId);
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

    // Manage Doctor Slots
    let current_slots = { ...doctor.slots_booked } || {};
    if (current_slots[slotDate]) {
        if (current_slots[slotDate].includes(slotTime)) {
            return NextResponse.json({ error: 'Slot already taken' }, { status: 400 });
        }
        current_slots[slotDate].push(slotTime);
    } else {
        current_slots[slotDate] = [slotTime];
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: current_slots });

    // 1. Save to main system (appointmentModel)
    const mainAppt = new appointmentModel({
        userId: userId || "AI_GUEST_USER",
        docId: docId,
        slotDate: slotDate,
        slotTime: slotTime,
        userData: { name: patientName, age: age, phone: "AI Booking" },
        docData: doctor,
        amount: doctor.fees,
        date: Date.now(),
        symptom: symptom
    });
    await mainAppt.save();

    // 2. Save to AI Logs (Appointment model) - UPDATED TO MATCH NEW SCHEMA
    const aiLog = await Appointment.create({
        patientName,
        age,
        docId,             // Added
        doctorName: doctor.name,
        slotDate,          // Matches schema
        slotTime,          // Matches schema
        symptom,
        status: 'confirmed'
    });

    return NextResponse.json({ success: true, appointment: aiLog }, { status: 201 });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - Delete appointment by ID
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    
    if (!deletedAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Appointment deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}

// PATCH - Update appointment status
export async function PATCH(request) {
  try {
    await connectDB();
    
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Appointment ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['confirmed', 'pending', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      appointment: {
        id: updatedAppointment._id.toString(),
        status: updatedAppointment.status
      }
    });
    
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}


