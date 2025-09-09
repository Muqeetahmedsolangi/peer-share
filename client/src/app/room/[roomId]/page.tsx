'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface User {
  id: string;
  name: string;
  isOnline: boolean;
  avatar?: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  fileData?: {
    name: string;
    size: number;
    type: string;
    icon: string;
    color: string;
  };
}

interface FileType {
  type: string;
  icon: string;
  color: string;
  category: 'image' | 'video' | 'document' | 'audio' | 'other';
}

export default function RoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  
  const [users] = useState<User[]>([
    { id: '1', name: 'You', isOnline: true },
    { id: '2', name: 'Alice Johnson', isOnline: true },
    { id: '3', name: 'Bob Smith', isOnline: false },
    { id: '4', name: 'Carol Davis', isOnline: true },
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Welcome to the room! 🎉', sender: 'System', timestamp: new Date(), type: 'system' },
    { id: '2', text: 'Hey everyone! Ready to share some files? 📁', sender: 'Alice Johnson', timestamp: new Date(), type: 'text' },
    { id: '3', text: 'Absolutely! This looks great. 👍', sender: 'Bob Smith', timestamp: new Date(), type: 'text' },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConnected] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // File type detection with icons
  const fileTypes: FileType[] = [
    // Images
    { type: 'image/jpeg', icon: '🖼️', color: 'text-green-400', category: 'image' },
    { type: 'image/png', icon: '🖼️', color: 'text-green-400', category: 'image' },
    { type: 'image/gif', icon: '🎞️', color: 'text-green-400', category: 'image' },
    { type: 'image/webp', icon: '🖼️', color: 'text-green-400', category: 'image' },
    { type: 'image/svg+xml', icon: '🎨', color: 'text-green-400', category: 'image' },
    
    // Videos
    { type: 'video/mp4', icon: '🎥', color: 'text-red-400', category: 'video' },
    { type: 'video/avi', icon: '🎬', color: 'text-red-400', category: 'video' },
    { type: 'video/mov', icon: '🎞️', color: 'text-red-400', category: 'video' },
    { type: 'video/wmv', icon: '🎥', color: 'text-red-400', category: 'video' },
    { type: 'video/webm', icon: '🎬', color: 'text-red-400', category: 'video' },
    
    // Documents
    { type: 'application/pdf', icon: '📄', color: 'text-blue-400', category: 'document' },
    { type: 'application/msword', icon: '📝', color: 'text-blue-400', category: 'document' },
    { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: '📝', color: 'text-blue-400', category: 'document' },
    { type: 'application/vnd.ms-excel', icon: '📊', color: 'text-green-400', category: 'document' },
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: '📊', color: 'text-green-400', category: 'document' },
    { type: 'text/plain', icon: '📄', color: 'text-gray-400', category: 'document' },
    { type: 'text/csv', icon: '📈', color: 'text-green-400', category: 'document' },
    
    // Audio
    { type: 'audio/mp3', icon: '🎵', color: 'text-purple-400', category: 'audio' },
    { type: 'audio/wav', icon: '🎶', color: 'text-purple-400', category: 'audio' },
    { type: 'audio/ogg', icon: '🎵', color: 'text-purple-400', category: 'audio' },
    { type: 'audio/m4a', icon: '🎶', color: 'text-purple-400', category: 'audio' },
  ];

  // Common emojis for quick access
  const commonEmojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  const getFileType = (file: File): FileType => {
    const fileType = fileTypes.find(ft => ft.type === file.type);
    return fileType || { type: file.type, icon: '📁', color: 'text-gray-400', category: 'other' };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    setIsVisible(true);
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Typing indicator effect
  useEffect(() => {
    if (isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim() && !isTyping) {
      setIsTyping(true);
    } else if (!e.target.value.trim()) {
      setIsTyping(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleFileShare = (file: File) => {
    const fileType = getFileType(file);
    const message: Message = {
      id: Date.now().toString(),
      text: `Shared file: ${file.name}`,
      sender: 'You',
      timestamp: new Date(),
      type: 'file',
      fileData: {
        name: file.name,
        size: file.size,
        type: file.type,
        icon: fileType.icon,
        color: fileType.color
      }
    };
    setMessages([...messages, message]);
    setSelectedFiles(selectedFiles.filter(f => f !== file));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Enhanced with Animations */}
      <div className={`relative z-10 pt-16 xs:pt-18 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 pb-2 xs:pb-3 sm:pb-4 border-b border-white/10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-4">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
              <button
                onClick={() => router.back()}
                className="group flex items-center text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 px-2 py-1 rounded-lg"
              >
                <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1 xs:mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs xs:text-sm font-medium">Back</span>
              </button>
              
            <div className="flex items-center space-x-2 xs:space-x-3">
              <div className={`w-2 h-2 xs:w-3 xs:h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse shadow-lg ${isConnected ? 'shadow-green-400/50' : 'shadow-red-400/50'}`}></div>
              <h1 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Room #{roomId}
              </h1>
              
              {/* Connected Users Pill - Only on Small Screens */}
              <div className="lg:hidden flex items-center space-x-1 px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full backdrop-blur-sm hover:bg-green-500/30 transition-all duration-300">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300 font-medium">
                  {users.filter(u => u.isOnline).length} online
                </span>
              </div>
            </div>
            </div>

            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
              <div className="hidden lg:block text-xs xs:text-sm text-gray-400 bg-slate-800/50 px-3 py-1 rounded-full border border-white/10">
                {users.filter(u => u.isOnline).length} online
              </div>
              <button className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 bg-red-600 hover:bg-red-700 text-white text-xs xs:text-sm rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25">
                Leave Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Optimized Height */}
      <div className="relative z-10 h-[calc(100vh-120px)] xs:h-[calc(100vh-130px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-150px)] lg:h-[calc(100vh-160px)]">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-full">
          <div className="flex flex-col lg:flex-row h-full gap-3 sm:gap-4 py-3 sm:py-4">
            
            {/* Chat Area - Optimized Size */}
            <div className={`flex-1 flex flex-col bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              
              {/* Messages - Optimized Spacing */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 sm:space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'} transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                      message.type === 'system' 
                        ? 'bg-blue-500/20 text-blue-300 text-center mx-auto border border-blue-400/30'
                        : message.sender === 'You'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-700/80 text-gray-200 hover:bg-slate-700 border border-slate-600/50'
                    }`}>
                      {message.type !== 'system' && (
                        <div className="text-xs font-semibold mb-1 opacity-80 flex items-center space-x-1">
                          <span>{message.sender}</span>
                          {message.sender === 'You' && (
                            <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      )}
                      <div className="text-sm sm:text-base break-words leading-relaxed">{message.text}</div>
                      {message.fileData && (
                        <div className="mt-2 p-2 bg-slate-600/50 rounded-lg hover:bg-slate-600/70 transition-colors duration-300">
                          <div className="flex items-center space-x-2">
                            <span className={`text-lg ${message.fileData.color} animate-pulse`}>{message.fileData.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-white truncate">{message.fileData.name}</div>
                              <div className="text-xs text-gray-400">{formatFileSize(message.fileData.size)}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className={`text-xs mt-1 flex items-center space-x-1 ${
                        message.sender === 'You' ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === 'You' && (
                          <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/80 text-gray-200 px-3 py-2 rounded-lg border border-slate-600/50">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-400">Someone is typing</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Optimized */}
              <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-t border-white/10">
                <div className="flex flex-col space-y-2">
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div 
                      ref={emojiPickerRef}
                      className="bg-slate-800/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 max-h-32 overflow-y-auto"
                    >
                      <div className="grid grid-cols-8 xs:grid-cols-10 sm:grid-cols-12 gap-1">
                        {commonEmojis.slice(0, 40).map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-lg hover:bg-white/10 rounded p-1 transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-1 xs:space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleInputChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all duration-300 hover:bg-slate-800/70 focus:bg-slate-800/70"
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      😀
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 sm:px-5 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Optimized Size */}
            <div className={`w-full lg:w-72 flex-shrink-0 space-y-3 sm:space-y-4 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              
              {/* Connected Users - Optimized */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl p-3 sm:p-4 hover:border-white/20 transition-all duration-300">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center">
                  <div className="w-4 h-4 mr-2 text-green-400 bg-green-400/20 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span>Connected Users</span>
                  <div className="ml-auto text-xs text-green-400 font-medium">
                    {users.filter(u => u.isOnline).length}
                  </div>
                </h3>
                <div className="space-y-2">
                  {users.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300 hover:scale-105 ${
                        user.isOnline ? 'bg-green-500/5 border border-green-500/20' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-gray-400'} transition-all duration-300`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate flex items-center space-x-1">
                          <span>{user.name}</span>
                          {user.isOnline && (
                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center space-x-1">
                          <span>{user.isOnline ? 'Online' : 'Offline'}</span>
                          {user.isOnline && (
                            <span className="text-green-400">●</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Sharing - Optimized */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>File Sharing</span>
                </h3>
                
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="block w-full p-3 border-2 border-dashed border-white/20 rounded-lg text-center cursor-pointer hover:border-blue-400/50 transition-colors"
                  >
                    <svg className="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <div className="text-sm text-gray-400">Click to upload files</div>
                  </label>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-white">Selected Files:</div>
                      {selectedFiles.map((file, index) => {
                        const fileType = getFileType(file);
                        return (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <span className={`text-base ${fileType.color}`}>{fileType.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-white truncate">{file.name}</div>
                                <div className="text-xs text-gray-400">
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileShare(file)}
                              className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                            >
                              Share
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Security Info - Optimized */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold text-green-300 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Security
                </h3>
                <div className="text-sm text-green-200 space-y-1">
                  <div>• End-to-end encrypted</div>
                  <div>• Peer-to-peer sharing</div>
                  <div>• Secure file transfer</div>
                  <div>• Private room access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}