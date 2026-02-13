import mongoose from 'mongoose';

const aiAppointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  doctorName: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true
  },
  date: {
    type: String, // You can change this to Date if you want to store actual ISO dates
    required: [true, 'Appointment date is required']
  },
  symptom: {
    type: String,
    required: [true, 'Symptom is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'confirmed'
  }
}, {
  timestamps: true,
});

// Prevent model recompilation in development (standard Next.js pattern)
const Appointment = mongoose.models.aiAppointment || mongoose.model('aiAppointment', aiAppointmentSchema);

export default Appointment;