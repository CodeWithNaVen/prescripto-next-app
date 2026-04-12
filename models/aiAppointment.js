import mongoose from 'mongoose';

const aiAppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age : { type: String, required: true },
  docId: { type: String, required: true }, 
  doctorName: { type: String, required: true },
  slotDate: { type: String, required: true }, // Changed from 'date'
  slotTime: { type: String, required: true }, // New
  symptom: { type: String, required: true },
  status: { type: String, enum: ['confirmed', 'pending', 'cancelled', 'completed'], default: 'confirmed' }
}, { timestamps: true });

// This line is crucial: it tries to get the existing model or creates a new one
const Appointment = mongoose.models.aiAppointment || mongoose.model('aiAppointment', aiAppointmentSchema);

export default Appointment;