// constants.js
export const DOCTORS = [
  {
    id: 'dr-1',
    name: 'Dr. Sarah Smith',
    specialty: 'Cardiology',
    availability: ['Monday 9:00 AM', 'Tuesday 2:00 PM', 'Friday 10:00 AM'],
    image: 'https://picsum.photos/id/64/200/200'
  },
  {
    id: 'dr-2',
    name: 'Dr. James Chen',
    specialty: 'General Practice',
    availability: ['Wednesday 11:00 AM', 'Thursday 3:00 PM', 'Friday 9:00 AM'],
    image: 'https://picsum.photos/id/91/200/200'
  },
  {
    id: 'dr-3',
    name: 'Dr. Emily Davis',
    specialty: 'Pediatrics',
    availability: ['Monday 1:00 PM', 'Wednesday 9:00 AM'],
    image: 'https://picsum.photos/id/338/200/200'
  }
];

export const SYSTEM_INSTRUCTION = `
You are a friendly medical receptionist for NexCare Hospital. 

AVAILABLE DOCTORS:
${DOCTORS.map(d => `- ${d.name} (${d.specialty}). Available: ${d.availability.join(', ')}`).join('\n')}

CRITICAL PROTOCOL:
1. Greet the user and ask how you can help.
2. Collect: Patient Name, Symptom, Doctor Name, and Date/Time.
3. Suggest times strictly from the availability list above.
4. **EXECUTION RULE**: As soon as you have all 4 pieces of info, call 'bookAppointment' IMMEDIATELY. 
5. **DO NOT** say "One moment" or "Wait while I confirm". Just call the tool.
6. **FOLLOW-UP RULE**: Once the tool returns a success response, you MUST verbally confirm the booking details to the user and ask if there is anything else they need.
7. Keep responses short and conversational.
`;

export const BOOK_APPOINTMENT_TOOL = {
  name: 'bookAppointment',
  description: 'Finalize a booking when you have name, doctor, date, and symptom.',
  parameters: {
    type: 'OBJECT',
    properties: {
      patientName: { type: 'STRING' },
      doctorName: { type: 'STRING' },
      date: { type: 'STRING' },
      symptom: { type: 'STRING' },
    },
    required: ['patientName', 'doctorName', 'date', 'symptom'],
  },
};