// constants.js
// export const DOCTORS = [
//   {
//     id: 'dr-1',
//     name: 'Dr. Sarah Smith',
//     specialty: 'Cardiology',
//     availability: ['Monday 9:00 AM', 'Tuesday 2:00 PM', 'Friday 10:00 AM'],
//     image: 'https://picsum.photos/id/64/200/200'
//   },
//   {
//     id: 'dr-2',
//     name: 'Dr. James Chen',
//     specialty: 'General Practice',
//     availability: ['Wednesday 11:00 AM', 'Thursday 3:00 PM', 'Friday 9:00 AM'],
//     image: 'https://picsum.photos/id/91/200/200'
//   },
//   {
//     id: 'dr-3',
//     name: 'Dr. Emily Davis',
//     specialty: 'Pediatrics',
//     availability: ['Monday 1:00 PM', 'Wednesday 9:00 AM'],
//     image: 'https://picsum.photos/id/338/200/200'
//   }
// ];

// export const SYSTEM_INSTRUCTION = `
// You are a friendly medical receptionist for NexCare Hospital. 

// AVAILABLE DOCTORS:
// ${DOCTORS.map(d => `- ${d.name} (${d.specialty}). Available: ${d.availability.join(', ')}`).join('\n')}

// CRITICAL PROTOCOL:
// 1. Greet the user and ask how you can help.
// 2. Collect: Patient Name, Symptom, Doctor Name, and Date/Time.
// 3. Suggest times strictly from the availability list above.
// 4. **EXECUTION RULE**: As soon as you have all 4 pieces of info, call 'bookAppointment' IMMEDIATELY. 
// 5. **DO NOT** say "One moment" or "Wait while I confirm". Just call the tool.
// 6. **FOLLOW-UP RULE**: Once the tool returns a success response, you MUST verbally confirm the booking details to the user and ask if there is anything else they need.
// 7. Keep responses short and conversational.
// `;

// export const BOOK_APPOINTMENT_TOOL = {
//   name: 'bookAppointment',
//   description: 'Finalize a booking when you have name, doctor, date, and symptom.',
//   parameters: {
//     type: 'OBJECT',
//     properties: {
//       patientName: { type: 'STRING' },
//       doctorName: { type: 'STRING' },
//       date: { type: 'STRING' },
//       symptom: { type: 'STRING' },
//     },
//     required: ['patientName', 'doctorName', 'date', 'symptom'],
//   },
// };

// export const generateSystemInstruction = (doctors) => {
//   return `
// You are a friendly medical receptionist for NexCare Hospital.

// AVAILABLE DOCTORS:
// ${doctors.map(d => 
//   `- ${d.name} (${d.speciality}). Available: ${
//     d.availabile?.join(', ') || 'Not specified'
//   }`
// ).join('\n')}

// CRITICAL PROTOCOL:
// 1. Greet the user and ask how you can help.
// 2. Collect: Patient Name, Symptom, Doctor Name, and Date/Time.
// 3. Suggest times strictly from the availability list above.
// 4. EXECUTION RULE: As soon as you have all 4 pieces of info, call 'bookAppointment' IMMEDIATELY.
// 5. DO NOT say "One moment" or "Wait while I confirm".
// 6. FOLLOW-UP RULE: Confirm booking after success.
// 7. Keep responses short and conversational.
// `;
// };



export const generateSystemInstruction = (doctors) => {
  // Get unique specialities
  const specialities = [...new Set(doctors.map(d => d.speciality))];
  
  // Create a minimal directory for the AI's internal reference
  const doctorContext = doctors.map(d => 
    `ID: ${d._id}, Name: ${d.name}, Speciality: ${d.speciality}, Fees: ${d.fees}`
  ).join(' | ');

  return `
You are the NexCare Hospital receptionist. 

DIRECTORY: ${doctorContext}

CONVERSATION LOGIC:
1. Greet the user. Ask for their name and what symptoms they are experiencing.
2. OPTIMIZATION: Do NOT list all doctors. Based on the symptom, suggest the ONE best doctor. 
   - Example: If they have "tooth pain", only mention the Dentist.
3. Once a doctor is chosen, suggest a time (Standard: 10:00 AM to 5:00 PM).
4. After you have: Patient Name, Age, Symptom, Doctor ID (from directory donot mention the doctor Id while talking to the users/patients), Date (Format: DD-MM-YYYY), and Time (Format: HH:MM AM/PM), call 'bookAppointment'.

CRITICAL: 
- Use the exact Doctor ID from the directory for the tool call.
- Keep responses under 2 sentences. Be helpful but brief.
`;
};

export const BOOK_APPOINTMENT_TOOL = {
  name: 'bookAppointment',
  description: 'Book an appointment in the database.',
  parameters: {
    type: 'OBJECT',
    properties: {
      patientName: { type: 'STRING' },
      age: { type: 'STRING', description: 'Age of the patient' },
      docId: { type: 'STRING' },
      doctorName: { type: 'STRING' },
      slotDate: { type: 'STRING', description: 'Format: D-M-YYYY (e.g. 10-8-2025)' }, // Match your DB
      slotTime: { type: 'STRING', description: 'Format: HH:MM AM/PM (e.g. 10:00 AM)' },
      symptom: { type: 'STRING' },
    },
    required: ['patientName', 'age', 'docId', 'slotDate', 'slotTime', 'symptom'],
  },
};