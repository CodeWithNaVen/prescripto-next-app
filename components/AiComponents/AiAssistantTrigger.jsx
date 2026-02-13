"use client";

import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import VoiceModal from './VoiceModal';
import toast from 'react-hot-toast';

const AiAssistantTrigger = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAppointmentBooked = async (appt) => {
        try {
            // Note: using the /api/ai/appointments route we created earlier
            const response = await fetch('/api/ai/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appt),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Appointment booked via AI!');
                // Optional: window.location.reload() if you want to refresh the list immediately
            } else {
                toast.error(data.error || 'Failed to book');
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Connection error');
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
            >
                <Phone size={16} />
                <span className="font-medium">AI Booking</span>
            </button>

            <VoiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAppointmentBooked={handleAppointmentBooked}
            />
        </>
    );
};

export default AiAssistantTrigger;