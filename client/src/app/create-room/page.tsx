'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Backend URL - Use localhost for development
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

        // Store password securely in sessionStorage (not in URL!)
        sessionStorage.setItem(`room-${data.roomId}-password`, password.trim());

        showNotification(`Room created! ID: ${data.roomId}`, 'success');

        // Navigate to room with the returned room ID (NO PASSWORD IN URL)
        setTimeout(() => {
          router.push(`/room/${data.roomId}?name=${encodeURIComponent(creatorName.trim())}`);
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

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating) {
      handleCreateRoom();
    }
  };

  return (
    <main className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="group flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </button>

            <div className={`inline-flex items-center px-3 py-1.5 bg-orange-100 border-2 border-orange-200 rounded-full transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-xs sm:text-sm text-orange-700 font-semibold tracking-wide">CREATE ROOM</span>
            </div>
          </div>

          {/* Main Content - Compact */}
          <div className={`text-center mb-4 sm:mb-6 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
              Create <span className="text-orange-500">Room</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Create a secure room for peer-to-peer file sharing and collaboration
            </p>
          </div>

          {/* Room Creation Form - Compact */}
          <div className={`bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="space-y-4 sm:space-y-5">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-orange-100 rounded-xl flex items-center justify-center group hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-orange-600 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Room Details</h3>
                <p className="text-sm text-gray-600">Enter your room information to get started</p>
              </div>

              <div className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Input Fields */}
                <div className="space-y-3">
                  {/* Creator Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your name..."
                      className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-300"
                    />
                  </div>

                  {/* Room Name and Password Row */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Room Name
                      </label>
                      <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter room name..."
                        className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-300"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Room Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Enter secure password..."
                          className="w-full px-4 py-2.5 pr-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-3">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-orange-700 font-semibold mb-1 text-sm">Security Features</h4>
                      <ul className="text-xs sm:text-sm text-orange-600 space-y-0.5">
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
                  className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-base"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </main>
  );
}
