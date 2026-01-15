'use client';

import { useEffect, useRef, useCallback } from 'react';
import { IncomingCallData } from '../services/callService';

interface IncomingCallModalProps {
  incomingCall: IncomingCallData;
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCallModal({ incomingCall, onAccept, onReject }: IncomingCallModalProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create synthetic ringtone using Web Audio API
  const playRingtone = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const playTone = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        // Ring tone pattern (two-tone like phone ring)
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        oscillator.frequency.setValueAtTime(480, audioContext.currentTime + 0.15); // B4

        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      };

      // Play tone pattern repeatedly
      playTone();
      intervalRef.current = setInterval(() => {
        playTone();
      }, 1000);

    } catch (error) {
      console.error('Failed to play ringtone:', error);
    }
  }, []);

  const stopRingtone = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  }, []);

  useEffect(() => {
    playRingtone();

    return () => {
      stopRingtone();
    };
  }, [playRingtone, stopRingtone]);

  const isVideoCall = incomingCall.callType === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-8 w-full max-w-sm mx-4 shadow-2xl border border-gray-700">
        {/* Animated rings */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-32 h-32 rounded-full bg-green-500/20 animate-ping" />
          <div className="absolute w-28 h-28 rounded-full bg-green-500/30 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <span className="text-4xl font-bold text-white">
              {incomingCall.callerName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Caller info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {incomingCall.callerName}
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            {isVideoCall ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            )}
            <span className="text-sm">
              Incoming {isVideoCall ? 'Video' : 'Audio'} Call
            </span>
          </div>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1 mt-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-8">
          {/* Decline button */}
          <button
            onClick={onReject}
            className="group relative"
          >
            <div className="absolute inset-0 bg-red-500/30 rounded-full blur-lg group-hover:bg-red-500/50 transition-all" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white rotate-135" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="block text-center text-sm text-gray-400 mt-2">Decline</span>
          </button>

          {/* Accept button */}
          <button
            onClick={onAccept}
            className="group relative"
          >
            <div className="absolute inset-0 bg-green-500/30 rounded-full blur-lg group-hover:bg-green-500/50 transition-all animate-pulse" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              {isVideoCall ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )}
            </div>
            <span className="block text-center text-sm text-gray-400 mt-2">Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
}
