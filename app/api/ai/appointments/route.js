// app/api/ai/appointments/route.js
import connectDB from '@/lib/db';
import Appointment from '@/models/aiAppointment';
import appointmentModel from '@/models/appointment';
import doctorModel from '@/models/doctor';
import { NextResponse } from 'next/server';

// GET - Fetch all appointments
// export async function GET() {
//   try {
//     await connectDB();
    
//     const appointments = await Appointment.find({})
//       .sort({ createdAt: -1 })
//       .lean();
    
//     const formattedAppointments = appointments.map(appt => ({
//       id: appt._id.toString(),
//       patientName: appt.patientName,
//       doctorName: appt.doctorName,
//       date: appt.date,
//       symptom: appt.symptom,
//       status: appt.status,
//       createdAt: appt.createdAt,
//       updatedAt: appt.updatedAt
//     }));

//     return NextResponse.json({ 
//       success: true,
//       appointments: formattedAppointments 
//     });
    
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch appointments' },
//       { status: 500 }
//     );
//   }
// }

// app/api/ai/appointments/route.js

export async function GET(request) {
  try {
    await connectDB();
    
    // Get doctorName from search params if it exists
    const { searchParams } = new URL(request.url);
    const doctorFilter = searchParams.get('doctor');
    
    console.log(doctorFilter);
    
    // Build query
    const query = doctorFilter ? { doctorName: doctorFilter } : {};
    
    const appointments = await Appointment.find(query)
      .sort({ date: 1 }) // Sort by appointment date for doctors
      .lean();
    
    const formattedAppointments = appointments.map(appt => ({
      id: appt._id.toString(),
      patientName: appt.patientName,
      doctorName: appt.doctorName,
      date: appt.date,
      symptom: appt.symptom,
      status: appt.status,
    }));

    return NextResponse.json({ success: true, appointments: formattedAppointments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST - Create new appointment and update doctor slots
export async function POST(request) {
  try {
    await connectDB();
    
     // --- SAFE JSON PARSING ---
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }
    // -------------------------
    
    // 1. Destructure the NEW fields we are sending from the AI tool
    const { patientName, docId, slotDate, slotTime, symptom, userId, status } = body;

    // 2. Updated Validation: Check for docId, slotDate, and slotTime
    if (!patientName || !docId || !slotDate || !slotTime || !symptom) {
      return NextResponse.json(
        { error: 'Missing required fields: patientName, docId, slotDate, slotTime, symptom' },
        { status: 400 }
      );
    }
    
    // 1. Fetch Doctor
    const doctor = await doctorModel.findById(docId);
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

    // 2. Manage Slots (Ensuring we use the Object reference correctly)
    let current_slots = { ...doctor.slots_booked } || {};

    if (current_slots[slotDate]) {
        if (current_slots[slotDate].includes(slotTime)) {
            return NextResponse.json({ error: 'Slot already taken' }, { status: 400 });
        }
        current_slots[slotDate].push(slotTime);
    } else {
        current_slots[slotDate] = [slotTime];
    }

    // 3. Update Doctor Model (Crucial for the Web UI to see the slot as booked)
    // We use findByIdAndUpdate to bypass potential version conflicts
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: current_slots });

    // 4. Save to main appointmentModel (Matches your JSON structure)
    const mainAppt = new appointmentModel({
        userId: userId || "AI_GUEST_USER",
        docId: docId,
        slotDate: slotDate,
        slotTime: slotTime,
        userData: { name: patientName, phone: "AI Booking" }, // Minimal user data
        docData: doctor, // Snapshot of doctor data as required by your model
        amount: doctor.fees,
        date: Date.now(),
        symptom: symptom
    });
    await mainAppt.save();

    // 5. Save to AI Logs
    const aiLog = await Appointment.create({
        patientName,
        doctorName: doctor.name,
        date: `${slotDate} at ${slotTime}`,
        symptom,
        status: 'confirmed'
    });

    return NextResponse.json({ success: true, appointment: aiLog }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
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


