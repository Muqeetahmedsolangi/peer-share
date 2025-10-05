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
                alert(`File received: ${file.name}`);
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
                
                // Show notification
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                notification.textContent = `💬 Message from ${data.senderName}`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
            });
        }
        
        return () => {
            socket?.off('text-message');
        };
    }, [socket, isConnected]);
    
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
            
            // Notify through socket about file sharing
            socket?.emit('file-share-start', {
                fileName: selectedFile.name,
                fileSize: selectedFile.size
            });
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
        
        // Add to own messages
        const newMessage: TextMessage = {
            id: Math.random().toString(36),
            content: textInput,
            senderName: 'You',
            timestamp: Date.now(),
            type: isCodeMode ? 'code' : 'text'
        };
        setReceivedMessages(prev => [...prev, newMessage]);
        
        setTextInput('');
        
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = isCodeMode ? '📝 Code sent!' : '💬 Message sent!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    };
    
    // Join network
    const handleJoin = () => {
        if (userName.trim()) {
            setIsJoined(true);
        } else {
            // Allow joining without name
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
    };

    // Copy text/code to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = '✓ Copied to clipboard!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    };

    // Preview Modal Component
    const PreviewModal = () => {
        if (!showPreview || !previewFile) return null;

        const fileUrl = URL.createObjectURL(previewFile);
        const fileType = previewFile.type.toLowerCase();

        return (
            <div 
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                onClick={closePreview}
            >
                <div 
                    className="relative max-w-6xl w-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">{previewFile.name}</h3>
                            <p className="text-gray-400 text-sm">
                                {(previewFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button
                                onClick={() => downloadFile(previewFile)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                            >
                                💾 Download
                            </button>
                            <button
                                onClick={closePreview}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                            >
                                ✕ Close
                            </button>
                        </div>
                    </div>

                    <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                        {fileType.startsWith('image/') && (
                            <img 
                                src={fileUrl} 
                                alt={previewFile.name}
                                className="max-w-full h-auto mx-auto rounded"
                            />
                        )}

                        {fileType.startsWith('video/') && (
                            <video 
                                src={fileUrl} 
                                controls 
                                className="max-w-full h-auto mx-auto rounded"
                            >
                                Your browser does not support video playback.
                            </video>
                        )}

                        {fileType.startsWith('audio/') && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="text-6xl mb-6">🎵</div>
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
                                className="w-full h-[calc(90vh-120px)] rounded border border-gray-700"
                                title={previewFile.name}
                            />
                        )}

                        {fileType.startsWith('text/') && (
                            <div className="bg-gray-800 p-6 rounded">
                                <pre className="text-white text-sm overflow-auto whitespace-pre-wrap">
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
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                onClick={() => setShowTextModal(false)}
            >
                <div 
                    className="relative max-w-4xl w-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
                        <h3 className="text-white font-semibold text-lg">Messages & Code ({receivedMessages.length})</h3>
                        <button
                            onClick={() => setShowTextModal(false)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                        >
                            ✕ Close
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 space-y-3">
                        {receivedMessages.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                No messages yet
                            </div>
                        ) : (
                            receivedMessages.map((msg) => (
                                <div 
                                    key={msg.id}
                                    className={`p-4 rounded-lg ${
                                        msg.senderName === 'You' 
                                            ? 'bg-blue-900 bg-opacity-50 border border-blue-700' 
                                            : 'bg-gray-800 border border-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white">{msg.senderName}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {msg.type === 'code' && (
                                                <span className="text-xs bg-purple-600 px-2 py-1 rounded">CODE</span>
                                            )}
                                            <button
                                                onClick={() => copyToClipboard(msg.content)}
                                                className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                                            >
                                                📋 Copy
                                            </button>
                                        </div>
                                    </div>
                                    {msg.type === 'code' ? (
                                        <pre className="bg-gray-950 p-3 rounded text-sm text-green-400 overflow-x-auto">
                                            <code>{msg.content}</code>
                                        </pre>
                                    ) : (
                                        <p className="text-white whitespace-pre-wrap">{msg.content}</p>
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

    if (!isJoined) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <div className="max-w-md mx-auto mt-20">
                    <h1 className="text-3xl font-bold mb-8 text-center">
                        Join Your WiFi Network
                    </h1>
                    <input
                        type="text"
                        placeholder="Enter your name (optional)"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg mb-4 text-white"
                    />
                    <button
                        onClick={handleJoin}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                        Join Network
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <button 
                    onClick={() => router.back()}
                    className="mb-8 text-gray-400 hover:text-white"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-bold mb-8 text-center">
                    WiFi Network Sharing
                </h1>
                
                {/* Connection Status */}
                <div className="bg-gray-800 p-4 rounded-lg mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Connection Status:</p>
                            <p className={`font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                {isConnected ? '✓ Connected' : '✗ Disconnected'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Users on Same WiFi:</p>
                            <p className="text-2xl font-bold text-blue-400">
                                {roomUsers.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Users List */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-bold mb-4">Users on Same Network:</h3>
                        {roomUsers.length === 0 ? (
                            <p className="text-gray-400">No other users on this network</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {roomUsers.map((user) => (
                                    <div 
                                        key={user.socketId} 
                                        className="bg-gray-700 p-3 rounded-lg"
                                    >
                                        <p className="font-semibold truncate">{user.name}</p>
                                        {user.socketId !== socket?.id && selectedFile && (
                                            <button
                                                onClick={() => sendFileToUser(user.socketId)}
                                                className="mt-2 text-sm px-3 py-1 bg-green-600 rounded hover:bg-green-500 w-full"
                                            >
                                                Send File
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* File Selection */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-bold mb-4">Select File to Share:</h3>
                        <div className="text-center">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 w-full"
                            >
                                📁 Select File
                            </button>
                            {selectedFile && (
                                <div className="mt-4 p-3 bg-gray-700 rounded">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="text-2xl">{getFileIcon(selectedFile)}</span>
                                            <div className="text-left flex-1 min-w-0">
                                                <p className="text-green-400 font-semibold truncate">{selectedFile.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        {canPreview(selectedFile) && (
                                            <button
                                                onClick={() => openPreview(selectedFile)}
                                                className="ml-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-500 text-sm"
                                            >
                                                👁️
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="*/*"
                        />
                    </div>
                </div>

                {/* Text/Code Sharing Section */}
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">Share Text or Code:</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCodeMode(!isCodeMode)}
                                className={`px-3 py-1 rounded text-sm ${
                                    isCodeMode 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-gray-700 text-gray-300'
                                }`}
                            >
                                {isCodeMode ? '📝 Code Mode' : '💬 Text Mode'}
                            </button>
                            {receivedMessages.length > 0 && (
                                <button
                                    onClick={() => setShowTextModal(true)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
                                >
                                    📨 View Messages ({receivedMessages.length})
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    sendTextMessage();
                                }
                            }}
                            placeholder={isCodeMode ? "Paste your code here..." : "Type your message here..."}
                            className={`flex-1 px-4 py-3 bg-gray-700 rounded-lg text-white resize-none ${
                                isCodeMode ? 'font-mono text-sm' : ''
                            }`}
                            rows={4}
                        />
                        <button
                            onClick={sendTextMessage}
                            disabled={!textInput.trim()}
                            className="px-6 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                            {isCodeMode ? '📝 Send Code' : '💬 Send'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Press Ctrl+Enter to send quickly
                    </p>
                </div>

                {/* Received Files */}
                {receivedFiles.length > 0 && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-bold mb-4">Received Files ({receivedFiles.length}):</h3>
                        <div className="space-y-3">
                            {receivedFiles.map((file, index) => (
                                <div key={index} className="p-3 bg-gray-700 rounded flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-3xl">{getFileIcon(file)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-green-400 font-semibold truncate">{file.name}</p>
                                            <p className="text-sm text-gray-400">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-2">
                                        {canPreview(file) && (
                                            <button
                                                onClick={() => openPreview(file)}
                                                className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 text-sm whitespace-nowrap"
                                            >
                                                👁️ Preview
                                            </button>
                                        )}
                                        <button
                                            onClick={() => downloadFile(file)}
                                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm whitespace-nowrap"
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

            {/* Modals */}
            <PreviewModal />
            <TextMessagesModal />
        </div>
    );
}