'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { WebRTCService } from '@/services/webrtcService';

export default function SameWifiPage() {
    const router = useRouter();
    
    // State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userName, setUserName] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [receivedFiles, setReceivedFiles] = useState<File[]>([]);
    const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null);
    
    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Use socket hook
    const { socket, isConnected, roomUsers, roomId } = useSocket(userName);
    
    // Initialize WebRTC when socket connects
    useEffect(() => {
        if (socket && isConnected) {
            const service = new WebRTCService(socket, (file) => {
                console.log('File received:', file);
                setReceivedFiles(prev => [...prev, file]);
                alert(`File received: ${file.name}`);
            });
            setWebrtcService(service);
        }
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
    
    // Join network
    const handleJoin = () => {
        if (userName.trim()) {
            setIsJoined(true);
        }
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
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
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
            <div className="max-w-4xl mx-auto">
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

                {/* Users List */}
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-4">Users on Same Network:</h3>
                    {roomUsers.length === 0 ? (
                        <p className="text-gray-400">No other users on this network</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {roomUsers.map((user) => (
                                <div 
                                    key={user.socketId} 
                                    className="bg-gray-700 p-3 rounded-lg"
                                >
                                    <p className="font-semibold">{user.name}</p>
                                    {user.socketId !== socket?.id && selectedFile && (
                                        <button
                                            onClick={() => sendFileToUser(user.socketId)}
                                            className="mt-2 text-sm px-3 py-1 bg-green-600 rounded hover:bg-green-500"
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
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-4">Select File to Share:</h3>
                    <div className="text-center">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                        >
                            Select File
                        </button>
                        {selectedFile && (
                            <div className="mt-4 p-3 bg-gray-700 rounded">
                                <p className="text-green-400">✓ Selected: {selectedFile.name}</p>
                                <p className="text-sm text-gray-400">
                                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
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

                {/* Received Files */}
                {receivedFiles.length > 0 && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-bold mb-4">Received Files:</h3>
                        {receivedFiles.map((file, index) => (
                            <div key={index} className="p-3 bg-gray-700 rounded mb-2">
                                <p className="text-green-400">📁 {file.name}</p>
                                <button
                                    onClick={() => {
                                        const url = URL.createObjectURL(file);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = file.name;
                                        a.click();
                                    }}
                                    className="mt-2 text-sm px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
                                >
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}