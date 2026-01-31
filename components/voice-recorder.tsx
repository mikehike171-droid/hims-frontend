'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Play, Pause, Trash2, Save } from 'lucide-react';

interface VoiceRecorderProps {
  onSave?: (audioBlob: Blob, transcript: string) => void;
  placeholder?: string;
}

export default function VoiceRecorder({ onSave, placeholder = "Click to start recording..." }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [transcript, setTranscript] = useState('');
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Simulate transcript generation
        setTimeout(() => {
          setTranscript("Patient examination discussion recorded. Voice transcript will appear here...");
        }, 1000);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setTranscript('');
    setDuration(0);
    setIsPlaying(false);
  };

  const saveRecording = () => {
    if (audioBlob && onSave) {
      onSave(audioBlob, transcript);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRecording && !audioBlob && (
              <Button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-500 font-medium">Recording... {formatTime(duration)}</span>
                </div>
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            )}
          </div>

          {/* Audio Playback */}
          {audioBlob && (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  onClick={isPlaying ? pauseAudio : playAudio}
                  variant="outline"
                  size="sm"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-sm text-gray-600">Duration: {formatTime(duration)}</span>
              </div>

              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Voice Transcript:</h4>
              <p className="text-sm text-gray-600">{transcript}</p>
            </div>
          )}

          {/* Action Buttons */}
          {audioBlob && (
            <div className="flex justify-center space-x-2">
              <Button
                onClick={saveRecording}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Recording
              </Button>
              <Button
                onClick={deleteRecording}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button
                onClick={() => {
                  deleteRecording();
                  startRecording();
                }}
                variant="outline"
                size="sm"
              >
                <Mic className="h-4 w-4 mr-2" />
                Record Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}