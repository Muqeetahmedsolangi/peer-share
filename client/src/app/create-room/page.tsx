'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Backend URL - Use api.dropsos.com subdomain for backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.dropsos.com';

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsVisible(true);
    // Load creator name from localStorage
    const savedName = localStorage.getItem('peershare-username') || '';
    if (savedName) {
      setCreatorName(savedName);
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim() || !password.trim() || !creatorName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    setError('');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: roomName.trim(),
          password: password.trim(),
          creatorName: creatorName.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Save creator name to localStorage
        localStorage.setItem('peershare-username', creatorName.trim());
        
        showNotification(`Room created! ID: ${data.roomId}`, 'success');
        
        // Navigate to room with the returned room ID
        setTimeout(() => {
          router.push(`/room/${data.roomId}?name=${encodeURIComponent(creatorName.trim())}&password=${encodeURIComponent(password.trim())}`);
        }, 1000);
      } else {
        setError(data.error || 'Failed to create room');
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to connect to server. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Enhanced */}
      <div className="relative z-10 pt-16 xs:pt-18 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 pb-4 xs:pb-6 sm:pb-8">
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
              <div className={`inline-flex items-center px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 backdrop-blur-sm transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-blue-400 rounded-full mr-1 xs:mr-2 animate-pulse"></div>
                <span className="text-xs xs:text-sm text-blue-300 font-semibold tracking-wide">CREATE ROOM</span>
              </div>
            </div>
          </div>

          {/* Main Content - Enhanced */}
          <div className="max-w-2xl mx-auto">
            <div className={`text-center mb-8 xs:mb-10 sm:mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 xs:mb-4 sm:mb-6 tracking-tight leading-none">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Create Room
                </span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto px-2 xs:px-0">
                Create a secure room for peer-to-peer file sharing and collaboration
              </p>
            </div>

            {/* Room Creation Form - Enhanced */}
            <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="space-y-4 xs:space-y-6">
                <div className="text-center mb-6 xs:mb-8">
                  <div className="w-16 h-16 xs:w-20 xs:h-20 mx-auto mb-3 xs:mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl xs:rounded-2xl flex items-center justify-center group hover:scale-105 transition-transform duration-300">
                    <svg className="w-8 h-8 xs:w-10 xs:h-10 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <h3 className="text-xl xs:text-2xl font-bold text-white mb-1 xs:mb-2">Room Details</h3>
                  <p className="text-sm xs:text-base text-gray-400">Enter your room information to get started</p>
                </div>

                <div className="space-y-4 xs:space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 xs:p-4">
                      <p className="text-red-300 text-sm xs:text-base">{error}</p>
                    </div>
                  )}

                  {/* Input Fields */}
                  <div className="space-y-3 xs:space-y-4">
                    {/* Creator Name */}
                    <div>
                      <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1 xs:mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        placeholder="Enter your name..."
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 bg-slate-800/50 border border-white/10 rounded-lg xs:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm xs:text-base transition-all duration-300"
                      />
                    </div>

                    {/* Room Name and Password Row */}
                    <div className="flex flex-col sm:flex-row gap-3 xs:gap-4">
                      <div className="flex-1">
                        <label className="block text-xs xs:text-sm font-medium text-gray-300 mb-1 xs:mb-2">
                          Room Name
                        </label>
                        <input
                          type="text"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                          placeholder="Enter room name..."
                          className="w-full px-3 xs:px-4 py-2 xs:py-3 bg-slate-800/50 border border-white/10 rounded-lg xs:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm xs:text-base transition-all duration-300"
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
                            placeholder="Enter secure password..."
                            className="w-full px-3 xs:px-4 py-2 xs:py-3 pr-10 xs:pr-12 bg-slate-800/50 border border-white/10 rounded-lg xs:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm xs:text-base transition-all duration-300"
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
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg xs:rounded-xl p-3 xs:p-4">
                    <div className="flex items-start space-x-2 xs:space-x-3">
                      <div className="w-5 h-5 xs:w-6 xs:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-blue-300 font-semibold mb-1 text-sm xs:text-base">Security Features</h4>
                        <ul className="text-xs xs:text-sm text-blue-200 space-y-0.5 xs:space-y-1">
                          <li>• End-to-end encryption for all communications</li>
                          <li>• Secure peer-to-peer file sharing</li>
                          <li>• Password-protected room access</li>
                          <li>• Real-time chat with message encryption</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    disabled={!roomName.trim() || !password.trim() || !creatorName.trim() || isCreating}
                    className="w-full py-3 xs:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg xs:rounded-xl hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center text-sm xs:text-base"
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 xs:mr-3 h-4 w-4 xs:h-5 xs:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Room...
                      </>
                    ) : (
                      'Create Room'
                    )}
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
