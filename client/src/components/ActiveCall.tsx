'use client';

import { useEffect, useRef, useState } from 'react';
import { CallParticipant } from '../services/callService';

interface ActiveCallProps {
  participants: Map<string, CallParticipant>;
  localStream: MediaStream | null;
  callType: 'audio' | 'video';
  onEndCall: () => void;
  onToggleAudio: () => boolean;
  onToggleVideo: () => Promise<boolean>;
  onUpgradeToVideo: () => Promise<boolean>;
}

function ParticipantTile({ participant, isLocal }: { participant: CallParticipant; isLocal: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gray-800 ${participant.isSpeaking ? 'ring-4 ring-green-500 ring-opacity-75' : ''} transition-all duration-200`}>
      {/* Video or Avatar */}
      {participant.isVideoEnabled && participant.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 min-h-[200px]">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center ${participant.isSpeaking ? 'animate-pulse' : ''}`}>
            <span className="text-3xl font-bold text-white">
              {participant.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Voice activity indicator (zigzag bars) */}
      {participant.isSpeaking && (
        <div className="absolute top-3 right-3 flex items-end gap-0.5 h-6">
          <div className="w-1 bg-green-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0ms' }} />
          <div className="w-1 bg-green-500 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '100ms' }} />
          <div className="w-1 bg-green-500 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '200ms' }} />
          <div className="w-1 bg-green-500 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
          <div className="w-1 bg-green-500 rounded-full animate-pulse" style={{ height: '50%', animationDelay: '50ms' }} />
        </div>
      )}

      {/* Name and status overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">
              {participant.displayName} {isLocal && '(You)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Audio status */}
            {!participant.isAudioEnabled && (
              <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </div>
            )}
            {/* Video status */}
            {!participant.isVideoEnabled && (
              <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActiveCall({
  participants,
  localStream,
  callType,
  onEndCall,
  onToggleAudio,
  onToggleVideo,
  onUpgradeToVideo
}: ActiveCallProps) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleAudio = () => {
    const newState = onToggleAudio();
    setIsAudioEnabled(newState);
  };

  const handleToggleVideo = async () => {
    const newState = await onToggleVideo();
    setIsVideoEnabled(newState);
  };

  const handleUpgradeToVideo = async () => {
    const success = await onUpgradeToVideo();
    if (success) {
      setIsVideoEnabled(true);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Convert participants map to array
  const participantList = Array.from(participants.values());
  const participantCount = participantList.length;

  // Determine grid layout based on participant count
  const getGridClass = () => {
    if (participantCount === 1) return 'grid-cols-1';
    if (participantCount === 2) return 'grid-cols-1 md:grid-cols-2';
    if (participantCount <= 4) return 'grid-cols-2';
    if (participantCount <= 6) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-3 md:grid-cols-4';
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-gray-900 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${callType === 'video' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
          <span className="text-white font-medium">
            {callType === 'video' ? 'Video Call' : 'Audio Call'}
          </span>
          <span className="text-gray-400 text-sm">
            {participantCount} participant{participantCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white font-mono bg-gray-700/50 px-3 py-1 rounded-full text-sm">
            {formatDuration(callDuration)}
          </span>
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            {isFullScreen ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Participants grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className={`grid ${getGridClass()} gap-4 h-full`}>
          {participantList.map((participant) => (
            <ParticipantTile
              key={participant.odId}
              participant={participant}
              isLocal={participant.odId === 'local'}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-4 py-6 bg-gray-800/80 backdrop-blur-sm">
        {/* Mute button */}
        <button
          onClick={handleToggleAudio}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isAudioEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isAudioEnabled ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        {/* Video toggle button */}
        {callType === 'video' ? (
          <button
            onClick={handleToggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isVideoEnabled ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            )}
          </button>
        ) : (
          // Upgrade to video button for audio calls
          <button
            onClick={handleUpgradeToVideo}
            className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all"
            title="Switch to video call"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        )}

        {/* End call button */}
        <button
          onClick={onEndCall}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all"
        >
          <svg className="w-6 h-6 text-white rotate-135" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
