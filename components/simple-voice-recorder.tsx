'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface SimpleVoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export default function SimpleVoiceRecorder({ onTranscript }: SimpleVoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; // Set to English for output
    }
  }, []);

  const startRecording = async () => {
    if (!isSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onTranscript(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      recognitionRef.current.start();
      setIsRecording(true);
      setDuration(0);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert('Unable to start speech recognition. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500">
        Speech recognition not supported in this browser
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {!isRecording ? (
        <Button
          onClick={startRecording}
          className="bg-red-500 hover:bg-red-600 text-white"
          size="sm"
        >
          <Mic className="h-4 w-4 mr-2" />
          Start Voice Recording
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 font-medium">Recording... {formatTime(duration)}</span>
          </div>
          <Button
            onClick={stopRecording}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
            size="sm"
          >
            <MicOff className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>
      )}
    </div>
  );
}