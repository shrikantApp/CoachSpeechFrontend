'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
    onTranscriptReady: (transcript: string) => void;
}

export default function AudioRecorder({ onTranscriptReady }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    const interimRef = useRef('');
    const isRecordingRef = useRef(false);

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        addEventListener("audiostart", (event) => { console.log("event", event) })
        console.log("recognition", recognition)
        recognition.onstart = (event: any) => {
            console.log("event", event)
        }
        recognition.onresult = (event: any) => {
            let currentTranscript = '';
            let interimTranscript = '';

            const resultsArray = Object.values(event?.results || []);

            resultsArray
                ?.slice(event.resultIndex)
                ?.forEach((item: any) => {
                    const transcriptPart = item?.[0]?.transcript;

                    if (item?.isFinal && transcriptPart) {
                        currentTranscript += transcriptPart + ' ';
                    } else if (transcriptPart) {
                        interimTranscript += transcriptPart;
                    }
                });

            interimRef.current = interimTranscript;

            if (currentTranscript.trim()) {
                setTranscript((prev) => prev + currentTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            if (isRecordingRef.current) {
                try {
                    recognition.start(); // restart automatically
                } catch (e) {
                    console.log("Restart prevented:", e);
                }
            }
        };


        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []); // ✅ RUN ONLY ONCE


    const toggleRecording = () => {
        if (!recognitionRef.current) return;

        if (isRecording) {
            isRecordingRef.current = false;
            recognitionRef.current.stop();
            setIsRecording(false);

            setTimeout(() => {
                if (transcript.trim()) {
                    onTranscriptReady(transcript.trim());
                }
                setTranscript('');
            }, 300);
        } else {
            setTranscript('');
            interimRef.current = '';
            isRecordingRef.current = true;

            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error("Start error:", e);
            }
        }
    };



    return (
        <div className="flex flex-col space-y-2 mt-2">
            <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isRecording
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 animate-pulse'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'
                    }`}
            >
                {isRecording ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        <span>Recording... Click to Stop & Append</span>
                    </>
                ) : (
                    <>
                        <Mic className="w-4 h-4" />
                        <span>Use Voice to Dictate (Speech-to-Text)</span>
                    </>
                )}
            </button>

            {isRecording && transcript && (
                <div className="text-xs text-gray-500 italic mt-1 px-2 border-l-2 border-red-300">
                    Recognizing: "{transcript}..."
                </div>
            )}
        </div>
    );
}
