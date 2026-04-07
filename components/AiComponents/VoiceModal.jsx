// components/AiComponents/VoiceModal.jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { X, Mic, MessageSquare, PhoneOff, Pause, Play } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import { BOOK_APPOINTMENT_TOOL, generateSystemInstruction, SYSTEM_INSTRUCTION } from '@/constants';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '@/utils/audioUtils';
import { useAppContext } from '@/context/AppContext';

const VoiceModal = ({ isOpen, onClose, onAppointmentBooked }) => {
    const { doctors } = useAppContext();
    const SYSTEM_INSTRUCTION = generateSystemInstruction(doctors);
    const [status, setStatus] = useState('idle'); // 'idle' | 'connecting' | 'connected' | 'error'
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Transcription Statep
    const [history, setHistory] = useState([]);
    const [realtimeInput, setRealtimeInput] = useState('');
    const [realtimeOutput, setRealtimeOutput] = useState('');

    // Audio Contexts & State Refs
    const inputContextRef = useRef(null);
    const outputContextRef = useRef(null);
    const sessionRef = useRef(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef(new Set());
    const streamRef = useRef(null);
    const processorRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const transcriptContainerRef = useRef(null);

    // Transcription Refs (to avoid stale closures)
    const inputBufferRef = useRef('');
    const outputBufferRef = useRef('');
    const isPausedRef = useRef(false);

    // Auto-scroll to bottom of transcript
    useEffect(() => {
        if (transcriptContainerRef.current) {
            transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
        }
    }, [history, realtimeInput, realtimeOutput]);

    const togglePause = () => {
        const newVal = !isPaused;
        setIsPaused(newVal);
        isPausedRef.current = newVal;

        if (newVal) {
            // If pausing, stop all current audio
            audioSourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) { }
            });
            audioSourcesRef.current.clear();
            setIsAiSpeaking(false);
            nextStartTimeRef.current = 0;
        } else {
            // Resuming... context is still alive
            if (outputContextRef.current) {
                nextStartTimeRef.current = outputContextRef.current.currentTime;
            }
        }
    };

    // Initialize connection when modal opens
    useEffect(() => {
        let mounted = true;

        const startSession = async () => {
            if (!isOpen) return;

            setStatus('connecting');
            setHistory([]);
            setRealtimeInput('');
            setRealtimeOutput('');
            setIsPaused(false);
            isPausedRef.current = false;
            inputBufferRef.current = '';
            outputBufferRef.current = '';

            try {
                const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
                if (!apiKey) {
                    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set');
                }

                const ai = new GoogleGenAI({ apiKey });

                // Setup Audio Contexts
                inputContextRef.current = new (window.AudioContext || (window).webkitAudioContext)({ sampleRate: 16000 });
                outputContextRef.current = new (window.AudioContext || (window).webkitAudioContext)({ sampleRate: 24000 });

                // Get Microphone Stream
                streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

                // Connect to Gemini Live
                const sessionPromise = ai.live.connect({
                    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                    config: {
                        responseModalities: [Modality.AUDIO],
                        systemInstruction: SYSTEM_INSTRUCTION,
                        tools: [{ functionDeclarations: [BOOK_APPOINTMENT_TOOL] }],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
                        },
                        // Enable Transcriptions
                        inputAudioTranscription: {},
                        outputAudioTranscription: {},
                    },
                    callbacks: {
                        onopen: () => {
                            if (!mounted) return;
                            console.log('Gemini Live Connection Opened');
                            setStatus('connected');

                            // Setup Audio Input Processing
                            if (!inputContextRef.current || !streamRef.current) return;

                            sourceNodeRef.current = inputContextRef.current.createMediaStreamSource(streamRef.current);
                            processorRef.current = inputContextRef.current.createScriptProcessor(4096, 1, 1);

                            processorRef.current.onaudioprocess = (e) => {
                                if (isPausedRef.current) return; // Don't send audio if paused

                                const inputData = e.inputBuffer.getChannelData(0);
                                const pcmBlob = createPcmBlob(inputData);

                                // Send audio to Gemini
                                sessionPromise.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            };

                            sourceNodeRef.current.connect(processorRef.current);
                            processorRef.current.connect(inputContextRef.current.destination);
                        },
                        onmessage: async (message) => {
                            if (!mounted) return;

                            // --- Transcription Handling ---
                            let transcriptUpdate = false;
                            if (message.serverContent?.inputTranscription) {
                                inputBufferRef.current += message.serverContent.inputTranscription.text;
                                setRealtimeInput(inputBufferRef.current);
                                transcriptUpdate = true;
                            }
                            if (message.serverContent?.outputTranscription) {
                                outputBufferRef.current += message.serverContent.outputTranscription.text;
                                setRealtimeOutput(outputBufferRef.current);
                                transcriptUpdate = true;
                            }

                            if (message.serverContent?.turnComplete) {
                                const userText = inputBufferRef.current;
                                const modelText = outputBufferRef.current;

                                setHistory(prev => {
                                    const newItems = [];
                                    if (userText.trim()) newItems.push({ role: 'user', text: userText.trim() });
                                    if (modelText.trim()) newItems.push({ role: 'model', text: modelText.trim() });
                                    return [...prev, ...newItems];
                                });

                                inputBufferRef.current = '';
                                outputBufferRef.current = '';
                                setRealtimeInput('');
                                setRealtimeOutput('');
                            }
                            // -----------------------------

                            // Handle Audio Output
                            const base64Audio = message?.serverContent?.modelTurn?.parts[0]?.inlineData?.data || '';
                            if (base64Audio && outputContextRef.current) {
                                if (isPausedRef.current) return; // Don't play if paused

                                setIsAiSpeaking(true);

                                const ctx = outputContextRef.current;
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

                                const audioBuffer = await decodeAudioData(
                                    base64ToUint8Array(base64Audio),
                                    ctx
                                );

                                const source = ctx.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(ctx.destination);

                                source.addEventListener('ended', () => {
                                    audioSourcesRef.current.delete(source);
                                    if (audioSourcesRef.current.size === 0) {
                                        setIsAiSpeaking(false);
                                    }
                                });

                                source.start(nextStartTimeRef.current);
                                nextStartTimeRef.current += audioBuffer.duration;
                                audioSourcesRef.current.add(source);
                            }

                            // Handle Interruption
                            if (message.serverContent?.interrupted) {
                                audioSourcesRef.current.forEach(s => {
                                    try { s.stop(); } catch (e) { }
                                });
                                audioSourcesRef.current.clear();
                                nextStartTimeRef.current = 0;
                                setIsAiSpeaking(false);

                                // If interrupted, push current buffers to history
                                if (outputBufferRef.current) {
                                    setHistory(prev => [...prev, { role: 'model', text: outputBufferRef.current.trim() }]);
                                    outputBufferRef.current = '';
                                    setRealtimeOutput('');
                                }
                            }

                            // Handle Tool Calls (Booking)
                            // if (message.toolCall) {
                            //     for (const fc of message.toolCall.functionCalls) {
                            //         if (fc.name === 'bookAppointment') {
                            //             console.log('💎 AI requested tool call:', fc.args);
                            //             const args = fc.args || {};

                            //             // 1. Create the appointment object
                            //             const newAppt = {
                            //                 id: Math.random().toString(36).substr(2, 9),
                            //                 patientName: args.patientName,
                            //                 doctorName: args.doctorName,
                            //                 date: args.date,
                            //                 symptom: args.symptom,
                            //                 status: 'confirmed'
                            //             };

                            //             console.log('📝 Triggering DB Save for:', newAppt);

                            //             // 2. IMPORTANT: Call parent function to save to MongoDB
                            //             // We do this immediately so the DB starts processing
                            //             onAppointmentBooked(newAppt);

                            //             // 3. Inform Gemini that the tool was executed successfully
                            //             // FIX: functionResponses MUST be an array []
                            //             try {
                            //                 const session = await sessionRef.current;
                            //                 if (session) {
                            //                     session.sendToolResponse({
                            //                         functionResponses: [{ //--- THIS MUST BE AN ARRAY
                            //                             id: fc.id,
                            //                             name: fc.name,
                            //                             response: {
                            //                                 result: "Success",
                            //                                 message: "Appointment confirmed and saved to database with ID: " + newAppt.id
                            //                             }
                            //                         }]
                            //                     });
                            //                     console.log('✅ Sent tool response back to Gemini');
                            //                 }
                            //             } catch (err) {
                            //                 console.error('❌ Failed to send tool response:', err);
                            //             }
                            //         }
                            //     }
                            // }

                            // Handle Tool Calls (Real Booking)
                            if (message.toolCall) {
                                const session = await sessionRef.current; // Get current session
                                
                                for (const fc of message.toolCall.functionCalls) {
                                    if (fc.name === 'bookAppointment') {
                                        const args = fc.args;
                                        // --- ADD THIS CHECK ---
                                        // Ensure we have the minimum required data before calling the API
                                        if (!args || !args.docId || !args.slotDate) {
                                            console.warn("💎 AI tried to book but arguments were incomplete yet.");
                                            return; 
                                        }
                                        // ----------------------
                                        console.log('💎 AI processing real booking for:', args.doctorName);

                                        try {
                                            // 1. Call your real API Route
                                            const response = await fetch('/api/ai/appointments', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    patientName: args.patientName,
                                                    docId: args.docId,        // Sent from tool
                                                    slotDate: args.slotDate,  // Sent from tool
                                                    slotTime: args.slotTime,  // Sent from tool
                                                    symptom: args.symptom,
                                                    userId: "AI_USER_VOICE"   // Placeholder or from context
                                                })
                                            });

                                            // Check if response is okay before parsing JSON
                                            if (!response.ok) {
                                                const errorData = await response.json();
                                                throw new Error(errorData.error || "API Error");
                                            }

                                            const result = await response.json();

                                            if (result.success) {
                                                // 2. Notify Gemini the DB is updated
                                                session.sendToolResponse({
                                                    functionResponses: [{
                                                        id: fc.id,
                                                        name: fc.name,
                                                        response: { 
                                                            result: "Success", 
                                                            message: `Appointment confirmed with Dr. ${args.doctorName} for ${args.slotDate} at ${args.slotTime}.` 
                                                        }
                                                    }]
                                                });
                                                
                                                // 3. Trigger UI Refresh in parent
                                                if (onAppointmentBooked){ 
                                                    onAppointmentBooked();
                                                }
                                                console.log('✅ DB Updated & Gemini Notified');
                                                
                                            } else {
                                                // 4. Notify Gemini if slot was taken or error occurred
                                                session.sendToolResponse({
                                                    functionResponses: [{
                                                        id: fc.id,
                                                        name: fc.name,
                                                        response: { result: "Error", message: result.error || "Slot is unavailable" }
                                                    }]
                                                });
                                            }
                                        } catch (err) {
                                            console.error('❌ Tool execution failed:', err);
                                        }
                                    }
                                }
                            }
                        },
                        onclose: () => {
                            if (mounted) setStatus('idle');
                        },
                        onerror: (err) => {
                            console.error(err);
                            if (mounted) setStatus('error');
                        }
                    }
                });

                sessionRef.current = sessionPromise;

            } catch (err) {
                console.error("Connection failed", err);
                setStatus('error');
            }
        };

        if (isOpen) {
            startSession();
        }

        // Cleanup function
        return () => {
            mounted = false;

            // Stop Inputs
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (sourceNodeRef.current) {
                sourceNodeRef.current.disconnect();
            }
            if (processorRef.current) {
                processorRef.current.disconnect();
            }
            if (inputContextRef.current) {
                inputContextRef.current.close();
            }

            // Stop Outputs
            audioSourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) { }
            });
            if (outputContextRef.current) {
                outputContextRef.current.close();
            }

            // Close Session
            if (sessionRef.current) {
                sessionRef.current.then((session) => {
                    try { session.close(); } catch (e) { }
                });
            }
        };
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-teal-400' : 'bg-slate-400'} ${status === 'connected' && !isPaused ? 'animate-pulse' : ''}`}></div>
                        <h2 className="text-white font-semibold text-lg">NexCare Assistant</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Visualizer & Status */}
                <div className="p-6 pb-2 shrink-0 bg-slate-50 border-b border-slate-100">
                    <div className="text-center mb-4">
                        {status === 'connecting' && <p className="text-slate-500 text-xs uppercase tracking-wider animate-pulse">Establishing Secure Connection...</p>}
                        {status === 'connected' && !isPaused && <p className="text-teal-600 text-xs uppercase tracking-wider font-semibold">Live Session Active</p>}
                        {status === 'connected' && isPaused && <p className="text-amber-500 text-xs uppercase tracking-wider font-semibold">Session Paused</p>}
                        {status === 'error' && <p className="text-red-500 text-xs uppercase tracking-wider font-semibold">Connection Error</p>}
                    </div>
                    {/* Visualizer shows flat line when paused */}
                    <AudioVisualizer isActive={status === 'connected' && !isPaused} isSpeaking={isAiSpeaking} />
                </div>

                {/* Transcript Feed (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" ref={transcriptContainerRef}>
                    {history.length === 0 && !realtimeInput && !realtimeOutput && (
                        <div className="text-center text-slate-400 py-8 italic text-sm">
                            <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                            <p>Conversation history will appear here.</p>
                            <p className="mt-2 text-xs">Try saying: &quot;Book an appointment with Dr. Smith&quot;</p>
                        </div>
                    )}

                    {history.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-teal-600 text-white rounded-tr-none'
                                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* Realtime Input */}
                    {realtimeInput && (
                        <div className="flex justify-end">
                            <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm bg-teal-600/70 text-white rounded-tr-none animate-pulse">
                                {realtimeInput}
                            </div>
                        </div>
                    )}

                    {/* Realtime Output */}
                    {realtimeOutput && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm bg-slate-100/70 text-slate-800 rounded-tl-none">
                                {realtimeOutput}
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-center space-x-6">
                    {/* End Call Button */}
                    <div
                        className={`p-3 rounded-full transition-all duration-300 bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer`}
                        onClick={onClose}
                        title="End Call"
                    >
                        <PhoneOff size={24} />
                    </div>

                    {/* Play/Pause Toggle Button */}
                    <div
                        className={`p-5 rounded-full shadow-lg transition-all duration-500 border-4 cursor-pointer flex items-center justify-center 
                 ${status === 'connected'
                                ? (isPaused
                                    ? 'bg-amber-100 text-amber-500 border-amber-200 hover:scale-105' // Paused state
                                    : 'bg-teal-500 text-white border-teal-200 hover:scale-105 shadow-teal-200' // Active state
                                )
                                : 'bg-slate-200 text-slate-400 border-transparent cursor-not-allowed'
                            }`}
                        onClick={status === 'connected' ? togglePause : undefined}
                        title={isPaused ? "Resume Assistant" : "Pause Assistant"}
                    >
                        {/* Show Play icon if paused, Pause icon if active. Loading if not connected */}
                        {status !== 'connected' ? <Mic size={28} /> : (isPaused ? <Play size={28} className="ml-1" /> : <Pause size={28} />)}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VoiceModal;