import connectDB from '@/lib/db';
import Appointment from '@/models/aiAppointment';
import { NextResponse } from 'next/server';

// GET - Fetch all appointments
export async function GET() {
  try {
    await connectDB();
    
    const appointments = await Appointment.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    const formattedAppointments = appointments.map(appt => ({
      id: appt._id.toString(),
      patientName: appt.patientName,
      doctorName: appt.doctorName,
      date: appt.date,
      symptom: appt.symptom,
      status: appt.status,
      createdAt: appt.createdAt,
      updatedAt: appt.updatedAt
    }));

    return NextResponse.json({ 
      success: true,
      appointments: formattedAppointments 
    });
    
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST - Create new appointment
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const { patientName, doctorName, date, symptom, status } = body;

    // Validate required fields
    if (!patientName || !doctorName || !date || !symptom) {
      return NextResponse.json(
        { error: 'Missing required fields: patientName, doctorName, date, symptom' },
        { status: 400 }
      );
    }

    const appointment = await Appointment.create({
      patientName,
      doctorName,
      date,
      symptom,
      status: status || 'confirmed'
    });

    return NextResponse.json({ 
      success: true, 
      appointment: {
        id: appointment._id.toString(),
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        date: appointment.date,
        symptom: appointment.symptom,
        status: appointment.status,
        createdAt: appointment.createdAt
      } 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create appointment' },
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