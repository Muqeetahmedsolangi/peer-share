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
  
  const [users, setUsers] = useState<User[]>([
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
  const [isConnected, setIsConnected] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileTypePicker, setShowFileTypePicker] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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

      {/* Header - Ultra Responsive */}
      <div className="relative z-10 pt-16 xs:pt-18 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 pb-2 xs:pb-3 sm:pb-4 border-b border-white/10">
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-4">
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
              <button
                onClick={() => router.back()}
                className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1 xs:mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs xs:text-sm">Back</span>
              </button>
              
            <div className="flex items-center space-x-2 xs:space-x-3">
              <div className={`w-2 h-2 xs:w-3 xs:h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <h1 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-white">Room #{roomId}</h1>
              
              {/* Connected Users Pill - Only on Small Screens */}
              <div className="lg:hidden flex items-center space-x-1 px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300 font-medium">
                  {users.filter(u => u.isOnline).length} online
                </span>
              </div>
            </div>
            </div>

            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
              <div className="hidden lg:block text-xs xs:text-sm text-gray-400">
                {users.filter(u => u.isOnline).length} online
              </div>
              <button className="px-2 xs:px-3 sm:px-4 py-1 xs:py-2 bg-red-600 hover:bg-red-700 text-white text-xs xs:text-sm rounded-lg transition-colors">
                Leave Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Ultra Responsive */}
      <div className="relative z-10 h-[calc(100vh-60px)] xs:h-[calc(100vh-70px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-90px)] lg:h-[calc(100vh-100px)] xl:h-[calc(100vh-110px)] 2xl:h-[calc(100vh-120px)]">
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 h-full">
          <div className="flex flex-col lg:flex-row h-full gap-2 xs:gap-3 sm:gap-4 py-2 xs:py-3 sm:py-4">
            
            {/* Chat Area - Responsive */}
            <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl xs:rounded-2xl min-h-0 lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px]">
              
              {/* Messages - Responsive */}
              <div className="flex-1 overflow-y-auto p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[200px] xs:max-w-[250px] sm:max-w-xs md:max-w-sm lg:max-w-lg xl:max-w-xl px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1 xs:py-2 md:py-3 lg:py-4 rounded-lg xs:rounded-xl ${
                      message.type === 'system' 
                        ? 'bg-blue-500/20 text-blue-300 text-center mx-auto'
                        : message.sender === 'You'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-200'
                    }`}>
                      {message.type !== 'system' && (
                        <div className="text-xs font-semibold mb-1 opacity-80">
                          {message.sender}
                        </div>
                      )}
                      <div className="text-xs xs:text-sm md:text-base lg:text-lg break-words">{message.text}</div>
                      {message.fileData && (
                        <div className="mt-2 p-2 bg-slate-600/50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className={`text-lg ${message.fileData.color}`}>{message.fileData.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-white truncate">{message.fileData.name}</div>
                              <div className="text-xs text-gray-400">{formatFileSize(message.fileData.size)}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className={`text-xs mt-1 ${
                        message.sender === 'You' ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Enhanced with Emojis */}
              <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 border-t border-white/10">
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
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 xs:py-2 md:py-3 lg:py-4 bg-slate-800/50 border border-white/10 rounded-lg xs:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs xs:text-sm md:text-base lg:text-lg"
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="px-2 xs:px-3 md:px-4 lg:px-5 py-1.5 xs:py-2 md:py-3 lg:py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg xs:rounded-xl transition-colors text-xs xs:text-sm md:text-base lg:text-lg"
                    >
                      😀
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 xs:py-2 md:py-3 lg:py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg xs:rounded-xl transition-colors text-xs xs:text-sm md:text-base lg:text-lg"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Responsive */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-2 xs:space-y-3 sm:space-y-4">
              
              {/* Connected Users - Responsive */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-white mb-2 xs:mb-3 sm:mb-4 flex items-center">
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1 xs:mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden xs:inline">Connected Users</span>
                  <span className="xs:hidden">Users</span>
                </h3>
                <div className="space-y-1 xs:space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2 xs:space-x-3 p-1.5 xs:p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className={`w-2 h-2 xs:w-3 xs:h-3 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs xs:text-sm font-medium text-white truncate">{user.name}</div>
                        <div className="text-xs text-gray-400">
                          {user.isOnline ? 'Online' : 'Offline'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Sharing - Enhanced with File Type Detection */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-white mb-2 xs:mb-3 sm:mb-4 flex items-center">
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1 xs:mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="hidden xs:inline">File Sharing</span>
                  <span className="xs:hidden">Files</span>
                </h3>
                
                <div className="space-y-2 xs:space-y-3">
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
                    className="block w-full p-2 xs:p-3 border-2 border-dashed border-white/20 rounded-lg xs:rounded-xl text-center cursor-pointer hover:border-blue-400/50 transition-colors"
                  >
                    <svg className="w-6 h-6 xs:w-8 xs:h-8 mx-auto mb-1 xs:mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <div className="text-xs xs:text-sm text-gray-400">Click to upload files</div>
                  </label>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-1 xs:space-y-2">
                      <div className="text-xs xs:text-sm font-medium text-white">Selected Files:</div>
                      {selectedFiles.map((file, index) => {
                        const fileType = getFileType(file);
                        return (
                          <div key={index} className="flex items-center justify-between p-1.5 xs:p-2 bg-slate-700/50 rounded-lg">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <span className={`text-sm xs:text-base ${fileType.color}`}>{fileType.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs xs:text-sm text-white truncate">{file.name}</div>
                                <div className="text-xs text-gray-400">
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileShare(file)}
                              className="ml-2 px-1.5 xs:px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
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

              {/* Security Info - Responsive */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-green-300 mb-2 xs:mb-3 flex items-center">
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1 xs:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Security
                </h3>
                <div className="text-xs xs:text-sm text-green-200 space-y-0.5 xs:space-y-1">
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