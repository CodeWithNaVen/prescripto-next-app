// components/AiComponents/VoiceModal.jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Mic, MessageSquare, PhoneOff, Pause, Play } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import { BOOK_APPOINTMENT_TOOL, SYSTEM_INSTRUCTION } from '@/constants';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '@/utils/audioUtils';

const VoiceModal = ({ isOpen, onClose, onAppointmentBooked }) => {
    const [status, setStatus] = useState('idle'); // 'idle' | 'connecting' | 'connected' | 'error'
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Transcription State
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

                const ai = new GoogleGenAI({apiKey});

                // Setup Audio Contexts
                inputContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                outputContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });

                // Get Microphone Stream
                streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

                // Connect to Gemini Live
                const sessionPromise = ai.live.connect({
                    model: 'gemini-2.0-flash-exp', // Ensure this matches your desired model
                    config: {
                        responseModalities: ["audio"],
                        systemInstruction: SYSTEM_INSTRUCTION,
                        tools: [{ functionDeclarations: [BOOK_APPOINTMENT_TOOL] }],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
                        },
                        inputAudioTranscription: {},
                        outputAudioTranscription: {},
                    },
                    callbacks: {
                        onopen: () => {
                            if (!mounted) return;
                            setStatus('connected');

                            if (!inputContextRef.current || !streamRef.current) return;

                            sourceNodeRef.current = inputContextRef.current.createMediaStreamSource(streamRef.current);
                            processorRef.current = inputContextRef.current.createScriptProcessor(4096, 1, 1);

                            processorRef.current.onaudioprocess = (e) => {
                                if (isPausedRef.current) return;
                                const inputData = e.inputBuffer.getChannelData(0);
                                const pcmBlob = createPcmBlob(inputData);

                                sessionPromise.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            };

                            sourceNodeRef.current.connect(processorRef.current);
                            processorRef.current.connect(inputContextRef.current.destination);
                        },
                        onmessage: async (message) => {
                            if (!mounted) return;

                            // Transcription Handling
                            if (message.serverContent?.inputTranscription) {
                                inputBufferRef.current += message.serverContent.inputTranscription.text;
                                setRealtimeInput(inputBufferRef.current);
                            }
                            if (message.serverContent?.outputTranscription) {
                                outputBufferRef.current += message.serverContent.outputTranscription.text;
                                setRealtimeOutput(outputBufferRef.current);
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

                            // Audio Output Handling
                            const base64Audio = message?.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data || '';
                            if (base64Audio && outputContextRef.current) {
                                if (isPausedRef.current) return;
                                setIsAiSpeaking(true);

                                const ctx = outputContextRef.current;
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

                                const audioBuffer = await decodeAudioData(base64ToUint8Array(base64Audio), ctx);
                                const source = ctx.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(ctx.destination);

                                source.addEventListener('ended', () => {
                                    audioSourcesRef.current.delete(source);
                                    if (audioSourcesRef.current.size === 0) setIsAiSpeaking(false);
                                });

                                source.start(nextStartTimeRef.current);
                                nextStartTimeRef.current += audioBuffer.duration;
                                audioSourcesRef.current.add(source);
                            }

                            // Handle Interruption
                            if (message.serverContent?.interrupted) {
                                audioSourcesRef.current.forEach(s => { try { s.stop(); } catch (e) { } });
                                audioSourcesRef.current.clear();
                                nextStartTimeRef.current = 0;
                                setIsAiSpeaking(false);
                            }

                            // Handle Tool Calls (Booking)
                            if (message.toolCall) {
                                for (const fc of message.toolCall.functionCalls) {
                                    if (fc.name === 'bookAppointment') {
                                        const args = fc.args;
                                        const newAppt = {
                                            id: Math.random().toString(36).substr(2, 9),
                                            ...args,
                                            status: 'confirmed'
                                        };

                                        onAppointmentBooked(newAppt);

                                        try {
                                            const session = await sessionRef.current;
                                            if (session) {
                                                session.sendToolResponse({
                                                    functionResponses: [{
                                                        id: fc.id,
                                                        name: fc.name,
                                                        response: { result: "Success", id: newAppt.id }
                                                    }]
                                                });
                                            }
                                        } catch (err) {
                                            console.error('Tool response failed', err);
                                        }
                                    }
                                }
                            }
                        },
                        onclose: () => { if (mounted) setStatus('idle'); },
                        onerror: (err) => { console.error(err); if (mounted) setStatus('error'); }
                    }
                });

                sessionRef.current = sessionPromise;
            } catch (err) {
                console.error("Connection failed", err);
                setStatus('error');
            }
        };

        if (isOpen) startSession();

        return () => {
            mounted = false;
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
            if (processorRef.current) processorRef.current.disconnect();
            if (inputContextRef.current) inputContextRef.current.close();
            audioSourcesRef.current.forEach(s => { try { s.stop(); } catch (e) { } });
            if (outputContextRef.current) outputContextRef.current.close();
            if (sessionRef.current) sessionRef.current.then(s => { try { s.close(); } catch (e) { } });
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

                {/* Visualizer */}
                <div className="p-6 pb-2 shrink-0 bg-slate-50 border-b border-slate-100">
                    <div className="text-center mb-4">
                        <p className="text-slate-500 text-xs uppercase tracking-wider">
                            {status === 'connecting' ? 'Connecting...' : status === 'connected' ? (isPaused ? 'Paused' : 'Live') : status}
                        </p>
                    </div>
                    <AudioVisualizer isActive={status === 'connected' && !isPaused} isSpeaking={isAiSpeaking} />
                </div>

                {/* Transcript */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" ref={transcriptContainerRef}>
                    {history.length === 0 && !realtimeInput && !realtimeOutput && (
                        <div className="text-center text-slate-400 py-8 italic text-sm">
                            <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                            <p>Try saying: "Book an appointment with Dr. Smith"</p>
                        </div>
                    )}

                    {history.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                                msg.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {realtimeInput && (
                        <div className="flex justify-end">
                            <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm bg-teal-600/70 text-white rounded-tr-none animate-pulse">
                                {realtimeInput}
                            </div>
                        </div>
                    )}

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
                    <button 
                        className="p-3 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                        onClick={onClose}
                    >
                        <PhoneOff size={24} />
                    </button>

                    <button
                        className={`p-5 rounded-full shadow-lg transition-all border-4 flex items-center justify-center ${
                            status === 'connected' 
                            ? (isPaused ? 'bg-amber-100 text-amber-500 border-amber-200' : 'bg-teal-500 text-white border-teal-200')
                            : 'bg-slate-200 text-slate-400 border-transparent'
                        }`}
                        onClick={status === 'connected' ? togglePause : undefined}
                    >
                        {status !== 'connected' ? <Mic size={28} /> : (isPaused ? <Play size={28} /> : <Pause size={28} />)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoiceModal;