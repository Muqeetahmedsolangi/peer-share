'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinRoomPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Load username from localStorage
    const savedUsername = localStorage.getItem('peershare-username') || '';
    if (savedUsername) {
      setUserName(savedUsername);
    }
  }, []);

  const handleJoinRoom = () => {
    if (!roomId.trim() || !userName.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Save username to localStorage
    localStorage.setItem('peershare-username', userName.trim());

    // Navigate to room with parameters
    router.push(`/room/${roomId.trim().toUpperCase()}?name=${encodeURIComponent(userName.trim())}&password=${encodeURIComponent(password.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className={`relative z-10 pt-16 xs:pt-18 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 pb-4 xs:pb-6 sm:pb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 items-start xs:items-center justify-between w-full">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300 mb-4 xs:mb-0"
            >
              <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1 xs:mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs xs:text-sm">Back</span>
            </button>

            <div className="flex justify-center w-full xs:w-auto">
              <div className={`inline-flex items-center px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400/30 backdrop-blur-sm transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-cyan-400 rounded-full mr-1 xs:mr-2 animate-pulse"></div>
                <span className="text-xs xs:text-sm text-cyan-300 font-semibold tracking-wide">JOIN ROOM</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto">
            <div className={`text-center mb-8 xs:mb-10 sm:mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 xs:mb-4 sm:mb-6 tracking-tight leading-none">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Join Room
                </span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto px-2 xs:px-0">
                Enter the room ID and password to join an existing room
              </p>
            </div>

            {/* Join Room Form */}
            <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="space-y-4 xs:space-y-6">
                <div className="text-center mb-6 xs:mb-8">
                  <div className="w-16 h-16 xs:w-20 xs:h-20 mx-auto mb-3 xs:mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl xs:rounded-2xl flex items-center justify-center group hover:scale-105 transition-transform duration-300">
                    <svg className="w-8 h-8 xs:w-10 xs:h-10 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl xs:text-2xl font-bold text-white mb-1 xs:mb-2">Room Information</h3>
                  <p className="text-sm xs:text-base text-gray-400">Enter the details to join the room</p>
                </div>

                <div className="space-y-4 xs:space-y-6">
                  {/* Your Name */}
                  <div>
                    <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1 xs:mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full px-3 xs:px-4 py-2 xs:py-3 bg-slate-800/50 border border-white/10 rounded-lg xs:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm xs:text-base transition-all duration-300"
                    />
                  </div>

                  {/* Room ID and Password Row */}
                  <div className="flex flex-col sm:flex-row gap-3 xs:gap-4">
                    <div className="flex-1">
                      <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1 xs:mb-2">
                        Room ID
                      </label>
                      <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                        placeholder="Enter room ID..."
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 bg-slate-800/50 border border-white/10 rounded-lg xs:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm xs:text-base transition-all duration-300 font-mono"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1 xs:mb-2">
                        Room Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter room password..."
                          className="w-full px-3 xs:px-4 py-2 xs:py-3 pr-10 xs:pr-12 bg-slate-800/50 border border-white/10 rounded-lg xs:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm xs:text-base transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 xs:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg xs:rounded-xl p-3 xs:p-4">
                    <div className="flex items-start space-x-2 xs:space-x-3">
                      <div className="w-5 h-5 xs:w-6 xs:h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-cyan-300 font-semibold mb-1 text-sm xs:text-base">Security & Privacy</h4>
                        <ul className="text-xs xs:text-sm text-cyan-200 space-y-0.5 xs:space-y-1">
                          <li>• End-to-end encrypted communications</li>
                          <li>• Secure peer-to-peer file sharing</li>
                          <li>• Password-protected room access</li>
                          <li>• Real-time messaging with security</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleJoinRoom}
                    disabled={!roomId.trim() || !userName.trim() || !password.trim()}
                    className="w-full py-3 xs:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg xs:rounded-xl hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center text-sm xs:text-base"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}