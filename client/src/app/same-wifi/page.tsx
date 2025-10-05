'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { WebRTCService } from '@/services/webrtcService';

interface TextMessage {
    id: string;
    content: string;
    senderName: string;
    timestamp: number;
    type: 'text' | 'code';
}

export default function SameWifiPage() {
    const router = useRouter();

    // State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userName, setUserName] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [receivedFiles, setReceivedFiles] = useState<File[]>([]);
    const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Text/Code sharing state
    const [textInput, setTextInput] = useState('');
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [receivedMessages, setReceivedMessages] = useState<TextMessage[]>([]);
    const [showTextModal, setShowTextModal] = useState(false);

    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Use socket hook
    const { socket, isConnected, roomUsers, roomId } = useSocket(userName);

    // Helper functions for localStorage with iOS Safari support
    const saveToStorage = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            // iOS Safari in private mode or storage disabled
            console.warn('localStorage not available:', e);
            // Fallback: use sessionStorage
            try {
                sessionStorage.setItem(key, value);
                return true;
            } catch (err) {
                console.warn('sessionStorage also not available:', err);
                return false;
            }
        }
    };

    const getFromStorage = (key: string): string | null => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            // iOS Safari in private mode
            console.warn('localStorage not available:', e);
            // Fallback: try sessionStorage
            try {
                return sessionStorage.getItem(key);
            } catch (err) {
                console.warn('sessionStorage also not available:', err);
                return null;
            }
        }
    };

    // Load username from storage on mount (iOS Safari compatible)
    useEffect(() => {
        const savedUsername = getFromStorage('peershare-username');
        if (savedUsername) {
            setUserName(savedUsername);
        }
        setIsVisible(true);
    }, []);

    // Auto-scroll messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [receivedMessages]);

    // Initialize WebRTC and listen for text messages
    useEffect(() => {
        if (socket && isConnected) {
            const service = new WebRTCService(socket, (file) => {
                console.log('File received:', file);
                setReceivedFiles(prev => [...prev, file]);
                showNotification(`📁 ${file.name}`, 'success');
            });
            setWebrtcService(service);

            // Listen for text messages
            socket.on('text-message', (data: any) => {
                const newMessage: TextMessage = {
                    id: Math.random().toString(36),
                    content: data.content,
                    senderName: data.senderName,
                    timestamp: Date.now(),
                    type: data.isCode ? 'code' : 'text'
                };
                setReceivedMessages(prev => [...prev, newMessage]);
                showNotification(`💬 ${data.senderName}`, 'success');
            });
        }

        return () => {
            socket?.off('text-message');
        };
    }, [socket, isConnected]);

    // Show notification helper
    const showNotification = (message: string, type: 'success' | 'info' = 'info') => {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 ${type === 'success' ? 'bg-green-600' : 'bg-blue-600'} text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2500);
    };

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Send file to a user
    const sendFileToUser = (targetSocketId: string) => {
        if (selectedFile && webrtcService) {
            webrtcService.sendFile(targetSocketId, selectedFile);
            socket?.emit('file-share-start', {
                fileName: selectedFile.name,
                fileSize: selectedFile.size
            });
            showNotification('📤 Sending...', 'info');
        }
    };

    // Send text/code to all users
    const sendTextMessage = () => {
        if (!textInput.trim() || !socket) return;

        socket.emit('text-message', {
            content: textInput,
            senderName: userName || 'Anonymous',
            isCode: isCodeMode,
            roomId: roomId
        });

        const newMessage: TextMessage = {
            id: Math.random().toString(36),
            content: textInput,
            senderName: 'You',
            timestamp: Date.now(),
            type: isCodeMode ? 'code' : 'text'
        };
        setReceivedMessages(prev => [...prev, newMessage]);
        setTextInput('');
        showNotification(isCodeMode ? '📝 Code sent!' : '💬 Sent!', 'success');
    };

    // Join network
    const handleJoin = () => {
        const finalUserName = userName.trim() || 'Anonymous';

        // Save username to storage (iOS Safari compatible)
        saveToStorage('peershare-username', finalUserName);

        if (userName.trim()) {
            setIsJoined(true);
        } else {
            setUserName('Anonymous');
            setIsJoined(true);
        }
    };

    // Get file icon based on type
    const getFileIcon = (file: File) => {
        const type = file.type.toLowerCase();
        if (type.startsWith('image/')) return '🖼️';
        if (type.startsWith('video/')) return '🎥';
        if (type.startsWith('audio/')) return '🎵';
        if (type.includes('pdf')) return '📄';
        if (type.includes('word') || type.includes('document')) return '📝';
        if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
        if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return '📦';
        if (type.includes('text')) return '📃';
        return '📁';
    };

    // Check if file can be previewed
    const canPreview = (file: File) => {
        const type = file.type.toLowerCase();
        return type.startsWith('image/') ||
               type.startsWith('video/') ||
               type.startsWith('audio/') ||
               type.includes('pdf') ||
               type.startsWith('text/');
    };

    // Open preview modal
    const openPreview = (file: File) => {
        setPreviewFile(file);
        setShowPreview(true);
    };

    // Close preview modal
    const closePreview = () => {
        setShowPreview(false);
        setPreviewFile(null);
    };

    // Download file
    const downloadFile = (file: File) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('💾 Downloading...', 'success');
    };

    // Copy text/code to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showNotification('✓ Copied!', 'success');
    };

    // Preview Modal Component
    const PreviewModal = () => {
        if (!showPreview || !previewFile) return null;

        const fileUrl = URL.createObjectURL(previewFile);
        const fileType = previewFile.type.toLowerCase();

        return (
            <div
                className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
                onClick={closePreview}
            >
                <div
                    className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-slate-800/90 p-3 sm:p-4 flex items-center justify-between border-b border-white/10">
                        <div className="flex-1 min-w-0 mr-3">
                            <h3 className="text-white font-semibold truncate text-sm sm:text-base">{previewFile.name}</h3>
                            <p className="text-gray-400 text-xs sm:text-sm">
                                {(previewFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button
                                onClick={() => downloadFile(previewFile)}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-300 text-xs sm:text-sm"
                            >
                                💾
                            </button>
                            <button
                                onClick={closePreview}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-300 text-xs sm:text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="p-3 sm:p-4 overflow-auto max-h-[calc(90vh-80px)]">
                        {fileType.startsWith('image/') && (
                            <img
                                src={fileUrl}
                                alt={previewFile.name}
                                className="max-w-full h-auto mx-auto rounded-lg"
                            />
                        )}

                        {fileType.startsWith('video/') && (
                            <video
                                src={fileUrl}
                                controls
                                className="max-w-full h-auto mx-auto rounded-lg"
                            >
                                Your browser does not support video playback.
                            </video>
                        )}

                        {fileType.startsWith('audio/') && (
                            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎵</div>
                                <audio
                                    src={fileUrl}
                                    controls
                                    className="w-full max-w-xl"
                                >
                                    Your browser does not support audio playback.
                                </audio>
                            </div>
                        )}

                        {fileType.includes('pdf') && (
                            <iframe
                                src={fileUrl}
                                className="w-full h-[calc(90vh-120px)] rounded-lg border border-white/10"
                                title={previewFile.name}
                            />
                        )}

                        {fileType.startsWith('text/') && (
                            <div className="bg-slate-900/50 p-4 sm:p-6 rounded-lg">
                                <pre className="text-white text-xs sm:text-sm overflow-auto whitespace-pre-wrap">
                                    {/* Text content will be loaded */}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Text Messages Modal
    const TextMessagesModal = () => {
        if (!showTextModal) return null;

        return (
            <div
                className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
                onClick={() => setShowTextModal(false)}
            >
                <div
                    className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-slate-800/90 p-3 sm:p-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
                        <h3 className="text-white font-semibold text-sm sm:text-lg">Messages ({receivedMessages.length})</h3>
                        <button
                            onClick={() => setShowTextModal(false)}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-300 text-xs sm:text-sm"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
                        {receivedMessages.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
                                <p className="text-sm sm:text-base">No messages yet</p>
                            </div>
                        ) : (
                            receivedMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-3 sm:p-4 rounded-lg backdrop-blur-sm transition-all duration-300 ${
                                        msg.senderName === 'You'
                                            ? 'bg-blue-600/20 border border-blue-400/30'
                                            : 'bg-slate-700/50 border border-white/10'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2 gap-2">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span className="font-semibold text-white text-xs sm:text-sm truncate">{msg.senderName}</span>
                                            <span className="text-xs text-gray-500 flex-shrink-0">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                                            {msg.type === 'code' && (
                                                <span className="text-xs bg-purple-600 px-2 py-1 rounded">CODE</span>
                                            )}
                                            <button
                                                onClick={() => copyToClipboard(msg.content)}
                                                className="text-xs bg-slate-600 px-2 py-1 rounded hover:bg-slate-500 transition-colors"
                                            >
                                                📋
                                            </button>
                                        </div>
                                    </div>
                                    {msg.type === 'code' ? (
                                        <pre className="bg-slate-950 p-2 sm:p-3 rounded text-xs sm:text-sm text-green-400 overflow-x-auto">
                                            <code>{msg.content}</code>
                                        </pre>
                                    ) : (
                                        <p className="text-white text-xs sm:text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                    )}
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
        );
    };

    // Join Screen - Mobile Optimized
    if (!isJoined) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
                    <div className="w-full max-w-md">
                        <div className={`text-center mb-6 sm:mb-8 transition-all duration-1000 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                                </svg>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight">
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                                    Same WiFi
                                </span>
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-gray-300 font-light px-2">
                                Join your WiFi network for instant file sharing
                            </p>
                        </div>

                        <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 transition-all duration-1000 delay-300 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                            <input
                                type="text"
                                placeholder="Enter your name (optional)"
                                value={userName}
                                onChange={(e) => {
                                    setUserName(e.target.value);
                                    // Update storage when user types (iOS Safari compatible)
                                    if (e.target.value.trim()) {
                                        saveToStorage('peershare-username', e.target.value);
                                    }
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base mb-3 sm:mb-4 transition-all duration-300"
                            />
                            <button
                                onClick={handleJoin}
                                className="w-full px-6 py-3 sm:py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform active:scale-95 text-sm sm:text-base"
                            >
                                Join Network
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Interface - Mobile First Design
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header - Mobile Optimized */}
            <div className={`relative z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-4 sm:pb-6 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button & Status */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm sm:text-base">Back</span>
                        </button>

                        <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400/30 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-xs sm:text-sm text-cyan-300 font-semibold">SAME WIFI</span>
                        </div>
                    </div>

                    {/* Main Title - Mobile */}
                    <div className={`text-center mb-4 sm:mb-6 transition-all duration-1000 delay-300 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 tracking-tight">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                                WiFi Network Sharing
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light px-4">
                            Share files instantly with users on the same network
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content - Mobile First */}
            <div className="relative z-10 pb-6 sm:pb-8">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">

                    {/* Connection Status - Compact Mobile */}
                    <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl p-4 sm:p-5 transition-all duration-1000 delay-500 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                                <div>
                                    <p className="text-xs text-gray-400">Status</p>
                                    <p className={`text-sm sm:text-base font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                        {isConnected ? 'Connected' : 'Disconnected'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Users Online</p>
                                <p className="text-xl sm:text-2xl font-bold text-cyan-400">
                                    {roomUsers.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Users & File - Mobile Stack */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">

                        {/* Users List - Ultra Compact */}
                        <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3 transition-all duration-1000 delay-700 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-semibold text-white flex items-center">
                                    <svg className="w-3 h-3 mr-1 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Users
                                </h3>
                                <span className="text-xs font-bold text-cyan-400">{roomUsers.length}</span>
                            </div>
                            {roomUsers.length === 0 ? (
                                <div className="text-center py-3">
                                    <p className="text-gray-500 text-xs">No users</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {roomUsers.map((user) => (
                                        <div
                                            key={user.socketId}
                                            className="bg-slate-700/40 border border-white/5 p-2 rounded-md hover:bg-slate-700/60 transition-colors"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></div>
                                                    <p className="text-xs font-medium text-white truncate">{user.name}</p>
                                                </div>
                                                {user.socketId !== socket?.id && selectedFile && (
                                                    <button
                                                        onClick={() => sendFileToUser(user.socketId)}
                                                        className="text-xs px-2 py-1 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded hover:from-green-500 hover:to-teal-500 transition-all active:scale-95 flex-shrink-0"
                                                    >
                                                        📤
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* File Selection - Compact */}
                        <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl p-3 sm:p-4 transition-all duration-1000 delay-900 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                            <h3 className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 flex items-center">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="hidden sm:inline">Select File to Share</span>
                                <span className="sm:hidden">Select File</span>
                            </h3>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full px-3 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 active:scale-95 text-xs sm:text-sm mb-2 sm:mb-3"
                            >
                                📁 Choose File
                            </button>
                            {selectedFile && (
                                <div className="p-2.5 sm:p-3 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className="text-xl sm:text-2xl flex-shrink-0">{getFileIcon(selectedFile)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-cyan-400 font-medium truncate text-xs sm:text-sm">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        {canPreview(selectedFile) && (
                                            <button
                                                onClick={() => openPreview(selectedFile)}
                                                className="px-2.5 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition-all duration-300 text-xs flex-shrink-0"
                                            >
                                                👁️
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="*/*"
                            />
                        </div>
                    </div>

                    {/* Text/Code Sharing - Input First */}
                    <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl p-3 sm:p-4 transition-all duration-1000 delay-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span className="hidden sm:inline">Share Text/Code</span>
                                <span className="sm:hidden">Message</span>
                            </h3>
                            <div className="flex gap-1.5 sm:gap-2">
                                <button
                                    onClick={() => setIsCodeMode(!isCodeMode)}
                                    className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                                        isCodeMode
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-slate-700 text-gray-300'
                                    }`}
                                >
                                    {isCodeMode ? '📝' : '💬'}
                                </button>
                                {receivedMessages.length > 0 && (
                                    <button
                                        onClick={() => setShowTextModal(true)}
                                        className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium"
                                    >
                                        📨 {receivedMessages.length}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) {
                                        sendTextMessage();
                                    }
                                }}
                                placeholder={isCodeMode ? "Paste code..." : "Type message..."}
                                className={`w-full px-3 py-2 sm:py-2.5 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-xs sm:text-sm ${
                                    isCodeMode ? 'font-mono' : ''
                                }`}
                                rows={3}
                            />
                            <button
                                onClick={sendTextMessage}
                                disabled={!textInput.trim()}
                                className="w-full px-3 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 text-xs sm:text-sm"
                            >
                                {isCodeMode ? '📝 Send Code' : '💬 Send'}
                            </button>
                        </div>
                    </div>

                    {/* Received Files - Compact */}
                    {receivedFiles.length > 0 && (
                        <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl p-3 sm:p-4 transition-all duration-1000 delay-1100 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                            <h3 className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 flex items-center">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                                <span className="hidden sm:inline">Received Files ({receivedFiles.length})</span>
                                <span className="sm:hidden">Received ({receivedFiles.length})</span>
                            </h3>
                            <div className="space-y-1.5 sm:space-y-2">
                                {receivedFiles.map((file, index) => (
                                    <div key={index} className="p-2.5 sm:p-3 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                            <span className="text-xl sm:text-2xl flex-shrink-0">{getFileIcon(file)}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-cyan-400 font-medium truncate text-xs sm:text-sm">{file.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 sm:gap-2">
                                            {canPreview(file) && (
                                                <button
                                                    onClick={() => openPreview(file)}
                                                    className="flex-1 px-2.5 py-1.5 sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 text-xs transition-all duration-300 active:scale-95"
                                                >
                                                    👁️ Preview
                                                </button>
                                            )}
                                            <button
                                                onClick={() => downloadFile(file)}
                                                className="flex-1 px-2.5 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 text-xs transition-all duration-300 active:scale-95"
                                            >
                                                💾 Download
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <PreviewModal />
            <TextMessagesModal />
        </div>
    );
}
