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
    isImage?: boolean;
    isFile?: boolean;
    fileName?: string;
    fileData?: string; // base64 data for files
}

export default function SameWifiPage() {
    const router = useRouter();

    // State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userName, setUserName] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [receivedFiles, setReceivedFiles] = useState<File[]>([]);
    const [sentFiles, setSentFiles] = useState<File[]>([]); // Track sent files
    const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Text/Code sharing state
    const [textInput, setTextInput] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<TextMessage[]>([]);
    const [showTextModal, setShowTextModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'text' | 'files'>('text');
    const [isDragging, setIsDragging] = useState(false);
    
    // Redis clips state
    interface SavedClip {
        clipId: string;
        savedBy?: string;
        savedById?: string;
        timestamp?: number;
        preview?: string;
        fileName?: string;
        fileType?: string;
        isFile?: boolean;
    }

    interface ExistingClipData {
        clipId: string;
        savedBy: string;
        savedById: string;
        timestamp: number;
        preview: string;
        fileName?: string;
        fileType?: string;
        isFile?: boolean;
    }
    const [savedClipIds, setSavedClipIds] = useState<SavedClip[]>([]);
    const [clipIdInput, setClipIdInput] = useState('');
    const [showClipModal, setShowClipModal] = useState(false);

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

    // Handle app visibility changes (when user goes to file picker and comes back)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // App came back to foreground (user returned from file picker)
                console.log('📱 App returned to foreground, checking connection...');
                
                // Check if socket is still connected
                if (socket) {
                    if (!socket.connected) {
                        console.log('⚠️ Socket disconnected while app was in background, will reconnect...');
                        // Socket.IO should auto-reconnect, but we can manually trigger if needed
                        if (!socket.active) {
                            socket.connect();
                        }
                    } else {
                        console.log('✅ Socket still connected');
                    }
                }
            } else {
                // App went to background (user opened file picker)
                console.log('📱 App went to background (file picker opened)');
            }
        };

        // Listen for visibility changes (works when file picker opens on mobile)
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Also listen for window focus/blur (backup for desktop)
        const handleWindowFocus = () => {
            console.log('🪟 Window focused, checking connection...');
            if (socket && !socket.connected) {
                console.log('⚠️ Socket disconnected, reconnecting...');
                if (!socket.active) {
                    socket.connect();
                }
            }
        };

        const handleWindowBlur = () => {
            console.log('🪟 Window blurred (file picker may have opened)');
        };

        window.addEventListener('focus', handleWindowFocus);
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleWindowFocus);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [socket]);

    // Initialize WebRTC and listen for text messages
    useEffect(() => {
        if (socket) {
            // Monitor connection status
            const handleDisconnect = () => {
                console.log('⚠️ Socket disconnected');
                showNotification('⚠️ Connection lost. Reconnecting...', 'info');
            };

            const handleReconnect = () => {
                console.log('✅ Socket reconnected');
                showNotification('✅ Reconnected to server', 'success');
            };

            const handleConnectError = (error: any) => {
                console.error('Socket connection error:', error);
                showNotification('❌ Connection error. Retrying...', 'info');
            };

            // Add connection monitoring
            socket.on('disconnect', handleDisconnect);
            socket.on('reconnect', handleReconnect);
            socket.on('connect_error', handleConnectError);

            if (isConnected) {
            const service = new WebRTCService(socket, (file) => {
                console.log('File received:', file);
                setReceivedFiles(prev => [...prev, file]);
                showNotification(`📁 ${file.name}`, 'success');
            });
            setWebrtcService(service);

            // Listen for text messages
            socket.on('text-message', (data: any) => {
                    try {
                const newMessage: TextMessage = {
                    id: Math.random().toString(36),
                    content: data.content,
                    senderName: data.senderName,
                    timestamp: Date.now(),
                            type: data.isCode ? 'code' : 'text',
                            isImage: data.isImage || false,
                            isFile: data.isFile || false,
                            fileName: data.fileName,
                            fileData: data.fileData
                };
                setReceivedMessages(prev => [...prev, newMessage]);
                showNotification(`💬 ${data.senderName}`, 'success');
                    } catch (error) {
                        console.error('Error handling text message:', error);
                    }
                });

                // Listen for clips saved by other users in the same WiFi network
                socket.on('clip-saved', (data: { clipId: string; savedBy: string; savedById: string; timestamp: number; preview?: string; fileName?: string; fileType?: string; isFile?: boolean }) => {
                    try {
                        setSavedClipIds(prev => {
                            const exists = prev.some(c => c.clipId === data.clipId);
                            if (!exists) {
                                const previewText = data.preview ? (data.preview.length > 50 ? data.preview.substring(0, 50) + '...' : data.preview) : '';
                                showNotification(`💾 ${data.savedBy} saved: ${previewText || 'a clip'}`, 'info');
                                return [{
                                    clipId: data.clipId,
                                    savedBy: data.savedBy,
                                    savedById: data.savedById,
                                    timestamp: data.timestamp,
                                    preview: data.preview,
                                    fileName: data.fileName,
                                    fileType: data.fileType,
                                    isFile: data.isFile
                                }, ...prev];
                            }
                            return prev;
                        });
                    } catch (error) {
                        console.error('Error handling clip-saved:', error);
                    }
                });

                // Listen for existing clips when joining a network
                socket.on('existing-clips', (data: { clips: ExistingClipData[] }) => {
                    try {
                        if (data.clips && data.clips.length > 0) {
                            setSavedClipIds(prev => {
                                const newClips = data.clips.filter(clip => !prev.some(c => c.clipId === clip.clipId));
                                if (newClips.length > 0) {
                                    showNotification(`📋 Found ${newClips.length} saved clip(s) from network`, 'info');
                                    return [...newClips.map(clip => ({
                                        clipId: clip.clipId,
                                        savedBy: clip.savedBy,
                                        savedById: clip.savedById,
                                        timestamp: clip.timestamp,
                                        preview: clip.preview,
                                        fileName: clip.fileName,
                                        fileType: clip.fileType,
                                        isFile: clip.isFile
                                    })), ...prev];
                                }
                                return prev;
                            });
                        }
                    } catch (error) {
                        console.error('Error handling existing-clips:', error);
                    }
                });
            }
        }

        return () => {
            if (socket) {
                socket.off('text-message');
                socket.off('clip-saved');
                socket.off('existing-clips');
                socket.off('disconnect');
                socket.off('reconnect');
                socket.off('connect_error');
            }
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

    // Helper function to wait for socket connection with retry logic
    const waitForConnection = async (maxWaitTime: number = 5000): Promise<boolean> => {
        if (!socket) {
            console.log('⚠️ No socket instance available');
            return false;
        }

        // If already connected, return immediately
        if (socket.connected) {
            return true;
        }

        // Try to reconnect if not active
        if (!socket.active) {
            console.log('🔄 Socket not active, attempting to connect...');
            socket.connect();
        }

        // Wait for connection with polling and event listener
        const startTime = Date.now();
        return new Promise((resolve) => {
            let resolved = false;

            // Listen for connect event (more reliable than polling)
            const onConnect = () => {
                if (!resolved) {
                    resolved = true;
                    console.log('✅ Socket connected (via event)');
                    socket.off('connect', onConnect);
                    socket.off('connect_error', onError);
                    resolve(true);
                }
            };

            const onError = () => {
                // Don't resolve on error, let timeout handle it
                console.log('⚠️ Connection error while waiting');
            };

            socket.on('connect', onConnect);
            socket.on('connect_error', onError);

            // Also poll as backup
            const checkConnection = () => {
                if (resolved) return;

                if (socket.connected) {
                    if (!resolved) {
                        resolved = true;
                        console.log('✅ Socket connected (via polling)');
                        socket.off('connect', onConnect);
                        socket.off('connect_error', onError);
                        resolve(true);
                    }
                    return;
                }

                const elapsed = Date.now() - startTime;
                if (elapsed >= maxWaitTime) {
                    if (!resolved) {
                        resolved = true;
                        console.log('⏱️ Connection wait timeout');
                        socket.off('connect', onConnect);
                        socket.off('connect_error', onError);
                        resolve(false);
                    }
                    return;
                }

                // Check again after a short delay
                setTimeout(checkConnection, 200);
            };

            checkConnection();
        });
    };

    // Handle file selection
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
        const file = event.target.files?.[0];
            if (!file) {
                return;
            }

            // Wait for connection after returning from file picker
            if (socket && (!socket.connected || !isConnected)) {
                console.log('⚠️ Socket disconnected after file picker, waiting for reconnection...');
                showNotification('🔄 Reconnecting...', 'info');
                
                const connected = await waitForConnection(5000);
                if (!connected) {
                    showNotification('❌ Could not reconnect. Please try again.', 'info');
                    // Reset file input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    return;
                }
                console.log('✅ Reconnected, processing file selection');
            }

            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                showNotification('❌ File size exceeds 10MB limit!', 'info');
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            setSelectedFile(file);
            showNotification(`📁 ${file.name} selected`, 'success');
        } catch (error) {
            console.error('Error selecting file:', error);
            showNotification('❌ Error selecting file', 'info');
            // Reset file input on error
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handle file input click - check connection before opening picker
    const handleFileInputClick = async () => {
        if (!socket) {
            showNotification('❌ Not connected to server', 'info');
            return;
        }

        // Check connection before opening file picker
        if (!socket.connected || !isConnected) {
            console.log('⚠️ Socket not connected before opening file picker, attempting to reconnect...');
            showNotification('🔄 Checking connection...', 'info');
            
            // Try to reconnect quickly before opening picker
            if (!socket.active) {
                socket.connect();
            }
            
            // Give it a short moment to reconnect, but don't block too long
            const connected = await waitForConnection(2000);
            if (!connected) {
                console.log('⚠️ Not connected, but opening file picker anyway (will reconnect after selection)');
            }
        }

        // Open file picker
        fileInputRef.current?.click();
    };

    // Handle file drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        try {
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                const file = files[0];
                // Check file size (10MB limit)
                if (file.size > 10 * 1024 * 1024) {
                    showNotification('❌ File size exceeds 10MB limit!', 'info');
                    return;
                }
                setSelectedFile(file);
                showNotification(`📁 ${file.name} selected`, 'success');
            }
        } catch (error) {
            console.error('Error handling file drop:', error);
            showNotification('❌ Error selecting file', 'info');
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

            // Add to sent files so user can see what they shared
            setSentFiles(prev => {
                // Check if file already exists
                const exists = prev.some(f => f.name === selectedFile.name && f.size === selectedFile.size);
                if (!exists) {
                    return [...prev, selectedFile];
                }
                return prev;
            });

            showNotification('📤 File sent!', 'success');
        }
    };

    // Send file/image to chat (all users)
    const sendFileToChat = async () => {
        if (!selectedFile) {
            showNotification('❌ No file selected', 'info');
            return;
        }

        if (!socket) {
            showNotification('❌ Not connected to server', 'info');
            return;
        }

        // Wait for connection if not connected
        if (!socket.connected || !isConnected) {
            console.log('⚠️ Socket not connected before sending file, waiting for reconnection...');
            showNotification('🔄 Reconnecting...', 'info');
            
            const connected = await waitForConnection(5000);
            if (!connected) {
                showNotification('❌ Could not reconnect. Please try again.', 'info');
                return;
            }
            console.log('✅ Reconnected, sending file');
        }

        try {
            // Convert file to base64 data URL for images, or send file info
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onerror = (error) => {
                    console.error('FileReader error:', error);
                    showNotification('❌ Error reading file', 'info');
                };

                reader.onload = (e) => {
                    try {
                        if (!socket || !isConnected) {
                            showNotification('❌ Connection lost', 'info');
                            return;
                        }

                        const dataUrl = e.target?.result as string;
                        
                        // Send as message with image data
                        socket.emit('text-message', {
                            content: dataUrl,
                            senderName: userName || 'Anonymous',
                            isCode: false,
                            isImage: true,
                            fileName: selectedFile.name,
                            roomId: roomId
                        });

                        // Add to sent files
                        setSentFiles(prev => {
                            const exists = prev.some(f => f.name === selectedFile.name && f.size === selectedFile.size);
                            if (!exists) {
                                return [...prev, selectedFile];
                            }
                            return prev;
                        });

                        // Add to messages
                        const newMessage: TextMessage = {
                            id: Math.random().toString(36),
                            content: dataUrl,
                            senderName: 'You',
                            timestamp: Date.now(),
                            type: 'text',
                            isImage: true,
                            fileName: selectedFile.name
                        };
                        setReceivedMessages(prev => [...prev, newMessage]);
                        setSelectedFile(null);
                        
                        // Reset file input
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        
                        showNotification('📤 Image shared in chat!', 'success');
                    } catch (error) {
                        console.error('Error sending image:', error);
                        showNotification('❌ Failed to send image', 'info');
                    }
                };
                
                reader.readAsDataURL(selectedFile);
            } else {
                // For non-image files, convert to base64 and send
                const reader = new FileReader();
                
                reader.onerror = (error) => {
                    console.error('FileReader error:', error);
                    showNotification('❌ Error reading file', 'info');
                };

                reader.onload = (e) => {
                    try {
                        if (!socket || !isConnected) {
                            showNotification('❌ Connection lost', 'info');
                            return;
                        }

                        const base64Data = e.target?.result as string;
                        
                        socket.emit('text-message', {
                            content: `📁 ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`,
                            senderName: userName || 'Anonymous',
                            isCode: false,
                            isFile: true,
                            fileName: selectedFile.name,
                            fileData: base64Data,
                            fileType: selectedFile.type,
                            roomId: roomId
                        });

                        const newMessage: TextMessage = {
                            id: Math.random().toString(36),
                            content: `📁 ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`,
                            senderName: 'You',
                            timestamp: Date.now(),
                            type: 'text',
                            isFile: true,
                            fileName: selectedFile.name,
                            fileData: base64Data
                        };
                        setReceivedMessages(prev => [...prev, newMessage]);
                        setSelectedFile(null);
                        
                        // Reset file input
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        
                        showNotification('📤 File shared in chat!', 'success');
                    } catch (error) {
                        console.error('Error sending file:', error);
                        showNotification('❌ Failed to send file', 'info');
                    }
                };
                
                reader.readAsDataURL(selectedFile);
            }
        } catch (error) {
            console.error('Error in sendFileToChat:', error);
            showNotification('❌ Failed to share file', 'info');
        }
    };

    // Send text/code to all users
    const sendTextMessage = () => {
        if (!textInput.trim() || !socket) return;

        socket.emit('text-message', {
            content: textInput,
            senderName: userName || 'Anonymous',
            isCode: false,
            roomId: roomId
        });

        const newMessage: TextMessage = {
            id: Math.random().toString(36),
            content: textInput,
            senderName: 'You',
            timestamp: Date.now(),
            type: 'text'
        };
        setReceivedMessages(prev => [...prev, newMessage]);
        setTextInput('');
        showNotification('💬 Sent!', 'success');
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

    // Download file from base64 data URL
    const downloadFileFromDataUrl = (dataUrl: string, fileName: string) => {
        try {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            link.click();
            showNotification('💾 Downloading...', 'success');
        } catch (error) {
            showNotification('❌ Failed to download file', 'info');
        }
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
                className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4"
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

    // Replace the old saveToRedis function with this:
    const saveToRedis = () => {
        if (!textInput.trim() || !socket) {
            showNotification('❌ No content to save or not connected!', 'info');
            return;
        }

        try {
            // Convert text to base64
            const clipText = btoa(unescape(encodeURIComponent(textInput.trim())));

            // Check size (10MB limit)
            const sizeInBytes = new Blob([clipText]).size;
            if (sizeInBytes > 10 * 1024 * 1024) {
                showNotification('❌ Content exceeds 10MB limit!', 'info');
                return;
            }

            // Generate clip ID
            const clipId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

            // Listen for response
            socket.once('save-clip-response', (response: any) => {
                if (response.success) {
                    // Get preview from current text input
                    const preview = textInput.trim().length > 200 
                        ? textInput.trim().substring(0, 200) + '...' 
                        : textInput.trim();
                    
                    // Store the clip ID with user info and preview
                    const newClip: SavedClip = {
                        clipId: response.clipId,
                        savedBy: userName || 'You',
                        timestamp: Date.now(),
                        preview: preview
                    };
                    setSavedClipIds(prev => {
                        const exists = prev.some(c => c.clipId === response.clipId);
                        if (!exists) {
                            return [newClip, ...prev];
                        }
                        return prev;
                    });
                    showNotification(`💾 Saved! Clip ID: ${response.clipId} (expires in 30 min)`, 'success');
                    // Optionally copy clip ID to clipboard
                    navigator.clipboard.writeText(response.clipId);
                } else {
                    showNotification(`❌ ${response.error || 'Failed to save'}`, 'info');
                }
            });

            // Emit save request
            socket.emit('save-clip', {
                clipId: clipId,
                clipText: clipText
            });

        } catch (error: any) {
            console.error('Error saving to Redis:', error);
            showNotification('❌ Failed to save. Please try again.', 'info');
        }
    };

    // Save file to Redis
    const saveFileToRedis = async () => {
        if (!selectedFile || !socket) {
            showNotification('❌ No file selected or not connected!', 'info');
            return;
        }

        try {
            // Check file size (10MB limit)
            if (selectedFile.size > 10 * 1024 * 1024) {
                showNotification('❌ File exceeds 10MB limit!', 'info');
                return;
            }

            // Read file as base64
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    // Convert ArrayBuffer to base64
                    const arrayBuffer = e.target.result as ArrayBuffer;
                    const bytes = new Uint8Array(arrayBuffer);
                    let binary = '';
                    for (let i = 0; i < bytes.byteLength; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    const clipText = btoa(binary);

                    // Generate clip ID
                    const clipId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

                    // Listen for response
                    socket.once('save-clip-response', (response: any) => {
                        if (response.success) {
                            // Store the clip ID with file info
                            const newClip: SavedClip = {
                                clipId: response.clipId,
                                savedBy: userName || 'You',
                                timestamp: Date.now(),
                                preview: `📁 ${selectedFile.name}`,
                                fileName: selectedFile.name,
                                fileType: selectedFile.type,
                                isFile: true
                            };
                            setSavedClipIds(prev => {
                                const exists = prev.some(c => c.clipId === response.clipId);
                                if (!exists) {
                                    return [newClip, ...prev];
                                }
                                return prev;
                            });
                            showNotification(`💾 File saved! Clip ID: ${response.clipId} (expires in 30 min)`, 'success');
                        } else {
                            showNotification(`❌ ${response.error || 'Failed to save'}`, 'info');
                        }
                    });

                    // Emit save request
                    socket.emit('save-clip', {
                        clipId: clipId,
                        clipText: clipText,
                        fileName: selectedFile.name,
                        fileType: selectedFile.type
                    });
                }
            };
            reader.onerror = () => {
                showNotification('❌ Failed to read file', 'info');
            };
            reader.readAsArrayBuffer(selectedFile);
        } catch (error: any) {
            console.error('Error saving file to Redis:', error);
            showNotification('❌ Failed to save file. Please try again.', 'info');
        }
    };

    // Function to retrieve clip from Redis (only for text clips)
    const getClipFromRedis = (clipId: string) => {
        if (!socket) {
            showNotification('❌ Not connected!', 'info');
            return;
        }

        socket.once('get-clip-response', (response: any) => {
            if (response.success && response.data) {
                try {
                    // Check if it's a file
                    if (response.data.isFile && response.data.fileName) {
                        showNotification('❌ This is a file. Please use the download button to get the file.', 'info');
                        return;
                    }
                    // Decode base64 back to text
                    const decodedText = decodeURIComponent(escape(atob(response.data.clipText)));
                    setTextInput(decodedText);
                    setShowClipModal(false);
                    showNotification(`📖 Clip loaded! (expires in 30 min)`, 'success');
                } catch (error) {
                    showNotification('❌ Failed to decode clip data', 'info');
                }
            } else {
                showNotification(`❌ ${response.error || 'Clip not found'}`, 'info');
            }
        });

        socket.emit('get-clip', { clipId });
    };

    // Handle retrieve clip by ID input
    const handleRetrieveClip = () => {
        if (!clipIdInput.trim()) {
            showNotification('❌ Please enter a clip ID', 'info');
            return;
        }
        getClipFromRedis(clipIdInput.trim());
    };

    // Copy clip content to clipboard (requires loading from Redis)
    const copyClipContent = async (clipId: string) => {
        if (!socket) {
            showNotification('❌ Not connected!', 'info');
            return;
        }

        socket.once('get-clip-response', (response: any) => {
            if (response.success && response.data) {
                try {
                    // Check if it's a file
                    if (response.data.isFile && response.data.fileName) {
                        showNotification('❌ Cannot copy file content. Please download the file instead.', 'info');
                    } else {
                        // Decode base64 back to text
                        const decodedText = decodeURIComponent(escape(atob(response.data.clipText)));
                        navigator.clipboard.writeText(decodedText);
                        showNotification('📋 Content copied!', 'success');
                    }
                } catch (error) {
                    showNotification('❌ Failed to decode clip data', 'info');
                }
            } else {
                showNotification(`❌ ${response.error || 'Clip not found'}`, 'info');
            }
        });

        socket.emit('get-clip', { clipId });
    };

    // Download file from clip
    const downloadClipFile = async (clipId: string, fileName: string, fileType?: string) => {
        if (!socket) {
            showNotification('❌ Not connected!', 'info');
            return;
        }

        socket.once('get-clip-response', (response: any) => {
            if (response.success && response.data) {
                try {
                    // Convert base64 back to file and download
                    const binaryString = atob(response.data.clipText);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    const blob = new Blob([bytes], { type: fileType || 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    showNotification(`📥 File downloaded: ${fileName}`, 'success');
                } catch (error) {
                    showNotification('❌ Failed to download file', 'info');
                }
            } else {
                showNotification(`❌ ${response.error || 'Clip not found'}`, 'info');
            }
        });

        socket.emit('get-clip', { clipId });
    };

    // Preview file from clip
    const previewClipFile = async (clipId: string, fileName: string, fileType?: string) => {
        if (!socket) {
            showNotification('❌ Not connected!', 'info');
            return;
        }

        socket.once('get-clip-response', (response: any) => {
            if (response.success && response.data) {
                try {
                    // Convert base64 back to file and preview
                    const binaryString = atob(response.data.clipText);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    const blob = new Blob([bytes], { type: fileType || 'application/octet-stream' });
                    const file = new File([blob], fileName, { type: fileType || 'application/octet-stream' });
                    setPreviewFile(file);
                    setShowPreview(true);
                } catch (error) {
                    showNotification('❌ Failed to preview file', 'info');
                }
            } else {
                showNotification(`❌ ${response.error || 'Clip not found'}`, 'info');
            }
        });

        socket.emit('get-clip', { clipId });
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
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex items-center justify-between border-b border-white/10 flex-shrink-0 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-lg">💬</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-base sm:text-lg">Messages</h3>
                                <p className="text-xs text-gray-400">{receivedMessages.length} message{receivedMessages.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowTextModal(false)}
                            className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 hover:scale-110"
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
                        {receivedMessages.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
                                <p className="text-sm sm:text-base">No messages yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {receivedMessages.map((msg) => {
                                    const isYou = msg.senderName === 'You';
                                    const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    
                                    return (
                                <div
                                    key={msg.id}
                                            className={`flex ${isYou ? 'justify-end' : 'justify-start'} group`}
                                >
                                            <div className={`flex flex-col ${isYou ? 'items-end' : 'items-start'} max-w-[75%] sm:max-w-[65%]`}>
                                                {/* Sender name (only for others) */}
                                                {!isYou && (
                                                    <span className="text-xs text-gray-400 mb-1 px-1 font-medium">
                                                        {msg.senderName}
                                            </span>
                                                )}
                                                
                                                {/* Message bubble */}
                                                <div className={`relative px-4 py-2.5 rounded-2xl shadow-lg break-words overflow-hidden ${isYou
                                                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-tr-sm shadow-lg shadow-green-500/20'
                                                        : 'bg-slate-700 text-white rounded-tl-sm border border-white/10'
                                                    }`} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                                    {msg.type === 'code' ? (
                                                        <div className="space-y-2 w-full">
                                                            <div className="flex items-center mb-1">
                                                                <span className="text-xs font-semibold text-purple-200 bg-purple-900/30 px-2 py-0.5 rounded">CODE</span>
                                        </div>
                                                            <pre className="bg-black/20 p-2 rounded text-xs sm:text-sm text-green-100 overflow-x-auto font-mono whitespace-pre-wrap break-words break-all overflow-wrap-anywhere max-w-full">
                                                                <code className="break-words break-all">{msg.content}</code>
                                                            </pre>
                                                        </div>
                                                    ) : (msg.isImage || msg.content.startsWith('data:image')) ? (
                                                        <div className="space-y-2 w-full">
                                                            <img 
                                                                src={msg.content} 
                                                                alt={msg.fileName || 'Image'} 
                                                                className="max-w-full h-auto rounded-lg border border-white/20"
                                                            />
                                                            {msg.fileName && (
                                                                <p className="text-xs text-gray-300 opacity-75">{msg.fileName}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm sm:text-base whitespace-pre-wrap break-words overflow-wrap-anywhere word-break-break-all">{msg.content}</p>
                                                    )}
                                                    
                                                    {/* Timestamp, Copy, and Save (for files and images) */}
                                                    <div className={`flex items-center gap-2 mt-2 ${isYou ? 'justify-end' : 'justify-start'}`}>
                                                        <span className={`text-xs ${isYou ? 'text-emerald-50' : 'text-gray-400'}`}>
                                                            {timeStr}
                                                        </span>
                                                        {(msg.isFile && msg.fileData) || (msg.isImage && msg.content.startsWith('data:image')) ? (
                                                            <button
                                                                onClick={() => downloadFileFromDataUrl(
                                                                    msg.isImage ? msg.content : msg.fileData!, 
                                                                    msg.fileName || (msg.isImage ? 'image.png' : 'download')
                                                                )}
                                                                className="relative p-2 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 rounded-lg flex-shrink-0 transition-all duration-300 hover:scale-110 shadow-lg shadow-blue-500/30 animate-pulse hover:animate-none hover:shadow-blue-500/50"
                                                                title="Save"
                                                            >
                                                                <span className="text-base block">💾</span>
                                                            </button>
                                                        ) : null}
                                            <button
                                                onClick={() => copyToClipboard(msg.content)}
                                                            className="relative p-2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-lg flex-shrink-0 transition-all duration-300 hover:scale-110 shadow-lg shadow-blue-500/30 animate-pulse hover:animate-none hover:shadow-blue-500/50"
                                                            title="Copy"
                                            >
                                                            <span className="text-base block">📋</span>
                                            </button>
                                        </div>
                                    </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Filter expired clips (older than 30 minutes)
    const filterExpiredClips = (clips: SavedClip[]) => {
        return clips.filter(clip => {
            if (!clip.timestamp) return true; // Keep clips without timestamp
            const ageInMinutes = (Date.now() - clip.timestamp) / 60000;
            return ageInMinutes < 30; // Only keep clips less than 30 minutes old
        });
    };

    // Periodic cleanup of expired clips (every 1 minute)
    useEffect(() => {
        const interval = setInterval(() => {
            setSavedClipIds(prev => filterExpiredClips(prev));
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    // Auto-remove expired clips when modal opens
    useEffect(() => {
        if (showClipModal) {
            setSavedClipIds(prev => filterExpiredClips(prev));
        }
    }, [showClipModal]);

    // Saved Clips Modal
    const SavedClipsModal = () => {
        if (!showClipModal) return null;

        // Filter out expired clips
        const validClips = filterExpiredClips(savedClipIds);

        return (
            <div
                className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
                onClick={() => setShowClipModal(false)}
            >
                <div
                    className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex items-center justify-between border-b border-white/10 flex-shrink-0 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                                <span className="text-white text-lg">💾</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-base sm:text-lg">Saved Clips</h3>
                                <p className="text-xs text-gray-400">{validClips.length} clip{validClips.length !== 1 ? 's' : ''} • expires in 30 min</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowClipModal(false)}
                            className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 hover:scale-110"
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
                        {validClips.length === 0 ? (
                            <div className="text-center text-gray-500 py-16">
                                <div className="w-20 h-20 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center">
                                    <span className="text-4xl">💾</span>
                                </div>
                                <p className="text-base font-medium mb-2">No saved clips yet</p>
                                <p className="text-sm text-gray-600">Save content to create clips</p>
                            </div>
                                    ) : (
                            <div className="space-y-3">
                                {validClips.map((clip, index) => {
                                    // Format timestamp
                                    const timeAgo = clip.timestamp ? (() => {
                                        const diff = Date.now() - clip.timestamp;
                                        const minutes = Math.floor(diff / 60000);
                                        if (minutes < 1) return 'just now';
                                        if (minutes === 1) return '1 min ago';
                                        if (minutes < 60) return `${minutes} mins ago`;
                                        const hours = Math.floor(minutes / 60);
                                        if (hours === 1) return '1 hour ago';
                                        return `${hours} hours ago`;
                                    })() : '';
                                    
                                    return (
                                        <div
                                            key={clip.clipId}
                                            className="p-4 bg-gradient-to-r from-purple-600/20 via-purple-500/15 to-purple-600/20 border border-purple-400/30 rounded-xl backdrop-blur-sm hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-purple-500/20 rounded-full border border-purple-400/30">
                                                            <span className="text-purple-300 font-semibold text-sm">💾 Clip #{index + 1}</span>
                                                        </div>
                                                        {clip.savedBy && (
                                                            <span className="text-xs text-gray-400">by <span className="text-purple-300 font-semibold">{clip.savedBy}</span></span>
                                                        )}
                                                        {timeAgo && (
                                                            <span className="text-xs text-gray-500">• {timeAgo}</span>
                                    )}
                                </div>
                                                    {clip.preview && (
                                                        <div className="bg-slate-900/60 px-4 py-3 rounded-lg border border-white/10 shadow-inner">
                                                            <p className="text-gray-100 text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed" title={clip.preview}>
                                                                {clip.preview}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    {clip.isFile && clip.fileName ? (
                                                        <>
                                                            {canPreview({ name: clip.fileName, type: clip.fileType || '' } as File) && (
                                                                <button
                                                                    onClick={() => previewClipFile(clip.clipId, clip.fileName!, clip.fileType)}
                                                                    className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 text-sm font-medium"
                                                                    title="Preview File"
                                                                >
                                                                    👁️
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => downloadClipFile(clip.clipId, clip.fileName!, clip.fileType)}
                                                                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 text-sm font-medium"
                                                                title="Download File"
                                                            >
                                                                💾
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => copyClipContent(clip.clipId)}
                                                                className="px-3 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-500 hover:to-slate-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                                                                title="Copy Content"
                                                            >
                                                                📋
                                                            </button>
                                                            <button
                                                                onClick={() => getClipFromRedis(clip.clipId)}
                                                                className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 text-sm font-medium"
                                                                title="Load into Editor"
                                                            >
                                                                📖
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
                        <div className={`text-center mb-6 sm:mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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

                        <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
            <div className={`relative z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-4 sm:pb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
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

                        {/* Status in Corner - Beautiful */}
                        <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'} animate-pulse`}></div>
                                <span className={`text-xs font-semibold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                </span>
                            </div>
                            <div className="w-px h-4 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-medium">Users</span>
                                <span className="px-2 py-0.5 bg-cyan-500/20 text-xs font-bold text-cyan-400 rounded-full">{roomUsers.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Title - Mobile */}
                    {/* <div className={`text-center mb-4 sm:mb-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 tracking-tight">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                                WiFi Network Sharing
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light px-4">
                            Share files instantly with users on the same network
                        </p>
                    </div> */}
                </div>
            </div>

            {/* Main Content - Mobile First */}
            <div className="relative z-10 pb-6 sm:pb-8">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Users List - Beautiful Horizontal Line */}
                    {roomUsers.length > 0 && (
                        <div className={`mb-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                            <div className="flex items-center gap-4 sm:gap-5 flex-wrap px-3 py-2 bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-full border border-white/5">
                                <span className="text-xs sm:text-sm text-gray-400 font-medium">Users</span>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    {roomUsers.map((user) => (
                                        <div
                                            key={user.socketId}
                                            className="flex items-center gap-2 px-3 py-1 bg-slate-700/30 rounded-full border border-white/5 hover:border-green-400/30 transition-all duration-300"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse"></div>
                                            <span className="text-sm sm:text-base text-white font-medium">{user.name}</span>
                                                </div>
                                    ))}
                                            </div>
                                        </div>
                                </div>
                            )}

                    {/* Split Layout: 55% Input, 45% Messages */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Input Area - 55% */}
                        <div className="flex-[0.55] min-w-0">
                            <div className="space-y-3 sm:space-y-4">
                                {/* Text/Code Sharing - Beautiful Design */}
                                <div className={`bg-gradient-to-br from-slate-800/70 via-slate-800/60 to-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    } h-[600px] flex flex-col`}>
                                    {/* Tabs */}
                                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/10">
                            <button
                                    onClick={() => setActiveTab('text')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                        activeTab === 'text'
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                    💬 Share Text
                            </button>
                                            <button
                                    onClick={() => setActiveTab('files')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                        activeTab === 'files'
                                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/50'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                            >
                                    📁 Share Files
                                            </button>
                                    </div>
                                        <div className="flex gap-2">
                                            {savedClipIds.length > 0 && (
                                <button
                                                    onClick={() => setShowClipModal(true)}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
                                    >
                                                    💾 {savedClipIds.length}
                                    </button>
                                )}
                            </div>
                        </div>
                                    {/* Tab Content */}
                                    {activeTab === 'text' ? (
                                        <div className="relative flex-1 min-h-0">
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) {
                                        sendTextMessage();
                                    }
                                }}
                                                placeholder="Type your message or paste code here..."
                                                className="w-full h-full px-4 py-3 pr-28 bg-slate-900/50 border-2 border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none text-sm sm:text-base transition-all duration-300 font-mono"
                                            />
                                            {/* Small buttons in bottom-right corner */}
                                            <div className="absolute bottom-3 right-3 flex gap-2">
                                                <button
                                                    onClick={saveToRedis}
                                                    disabled={!textInput.trim() || !socket}
                                                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center gap-1.5"
                                                >
                                                    <span>💾</span>
                                                    <span>Save</span>
                                                </button>
                            <button
                                onClick={sendTextMessage}
                                disabled={!textInput.trim()}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center gap-1.5"
                            >
                                                    <span>💬</span>
                                                    <span>Send</span>
                            </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 min-h-0 flex flex-col">
                                {/* Drag and Drop File Selector - Full height when no file, 80% when file selected */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleFileInputClick}
                                    className={`relative border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                                        selectedFile ? 'flex-[0.8]' : 'flex-1'
                                    } ${
                                        isDragging
                                            ? 'border-cyan-400 bg-cyan-500/10'
                                            : 'border-white/20 hover:border-cyan-400/50 hover:bg-cyan-500/5'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept="*/*"
                                    />
                                    <div className="flex flex-col items-center gap-4 p-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-4xl">📁</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-base sm:text-lg mb-1">
                                                {isDragging ? 'Drop file here' : 'Click or drag file here'}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                Maximum file size: 10MB
                                            </p>
                                        </div>
                        </div>
                    </div>

                                {/* Selected File Display - 20% when file selected */}
                                {selectedFile && (
                                    <div className="flex-[0.2] mt-3">
                                        <div className="p-3 bg-gradient-to-r from-slate-700/60 to-slate-800/60 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg h-full flex flex-col">
                                            {/* File Info */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10">
                                                    <span className="text-xl">{getFileIcon(selectedFile)}</span>
                                                </div>
                                            <div className="flex-1 min-w-0">
                                                    <p className="text-white font-semibold truncate text-xs mb-0.5">{selectedFile.name}</p>
                                                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                            
                                            {/* Preview, Save, and Send buttons in one line */}
                                            <div className="flex gap-2 mt-auto">
                                                {canPreview(selectedFile) && (
                                                <button
                                                        onClick={() => openPreview(selectedFile)}
                                                        className="flex-1 px-2 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/50 text-xs font-medium"
                                                >
                                                    👁️ Preview
                                                </button>
                                            )}
                                            <button
                                                    onClick={saveFileToRedis}
                                                    disabled={!socket}
                                                    className="flex-1 px-2 py-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98] text-xs shadow-lg"
                                                    style={{
                                                        backgroundSize: '200% 200%',
                                                        transition: 'background-position 0.3s ease'
                                                    }}
                                            >
                                                    💾 Save
                                                </button>
                                                <button
                                                    onClick={sendFileToChat}
                                                    disabled={!socket}
                                                    className="flex-1 px-2 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                                                >
                                                    💬 Send
                                            </button>
                                        </div>
                                    </div>
                            </div>
                                )}
                        </div>
                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages Area - 45% */}
                        <div className="flex-[0.45] min-w-0">
                            <div className={`bg-gradient-to-br from-slate-800/70 via-slate-800/60 to-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                } h-[600px] flex flex-col`}>
                                {/* Messages Header */}
                                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-lg">💬</span>
                                            </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-base sm:text-lg">Messages</h3>
                                            <p className="text-xs text-gray-400">{receivedMessages.length} message{receivedMessages.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Content */}
                                <div className="flex-1 overflow-auto p-4 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
                                    {receivedMessages.length === 0 ? (
                                        <div className="text-center text-gray-500 py-12">
                                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
                                            <p className="text-sm sm:text-base">No messages yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {receivedMessages.map((msg) => {
                                                const isYou = msg.senderName === 'You';
                                                const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex ${isYou ? 'justify-end' : 'justify-start'} group`}
                                                    >
                                                        <div className={`flex flex-col ${isYou ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                                            {/* Sender name (only for others) */}
                                                            {!isYou && (
                                                                <span className="text-xs text-gray-400 mb-1 px-1 font-medium">
                                                                    {msg.senderName}
                                                                </span>
                                                            )}
                                                            
                                                            {/* Message bubble */}
                                                            <div className={`relative px-4 py-2.5 rounded-2xl shadow-lg break-words overflow-hidden ${isYou
                                                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-tr-sm shadow-lg shadow-green-500/20'
                                                                    : 'bg-slate-700 text-white rounded-tl-sm border border-white/10'
                                                                }`} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                                                {msg.type === 'code' ? (
                                                                    <div className="space-y-2 w-full">
                                                                        <div className="flex items-center mb-1">
                                                                            <span className="text-xs font-semibold text-purple-200 bg-purple-900/30 px-2 py-0.5 rounded">CODE</span>
                                                                        </div>
                                                                        <pre className="bg-black/20 p-2 rounded text-xs sm:text-sm text-green-100 overflow-x-auto font-mono whitespace-pre-wrap break-words break-all overflow-wrap-anywhere max-w-full">
                                                                            <code className="break-words break-all">{msg.content}</code>
                                                                        </pre>
                                                                    </div>
                                                                ) : (msg.isImage || msg.content.startsWith('data:image')) ? (
                                                                    <div className="space-y-2 w-full">
                                                                        <img 
                                                                            src={msg.content} 
                                                                            alt={msg.fileName || 'Image'} 
                                                                            className="max-w-full h-auto rounded-lg border border-white/20"
                                                                        />
                                                                        {msg.fileName && (
                                                                            <p className="text-xs text-gray-300 opacity-75">{msg.fileName}</p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm sm:text-base whitespace-pre-wrap break-words overflow-wrap-anywhere word-break-break-all">{msg.content}</p>
                                                                )}
                                                                
                                                                {/* Timestamp, Copy, and Save (for files and images) */}
                                                                <div className={`flex items-center gap-2 mt-2 ${isYou ? 'justify-end' : 'justify-start'}`}>
                                                                    <span className={`text-xs ${isYou ? 'text-emerald-50' : 'text-gray-400'}`}>
                                                                        {timeStr}
                                                                    </span>
                                                                    {(msg.isFile && msg.fileData) || (msg.isImage && msg.content.startsWith('data:image')) ? (
                                                <button
                                                                            onClick={() => downloadFileFromDataUrl(
                                                                                msg.isImage ? msg.content : msg.fileData!, 
                                                                                msg.fileName || (msg.isImage ? 'image.png' : 'download')
                                                                            )}
                                                                            className="relative p-2 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 rounded-lg flex-shrink-0 transition-all duration-300 hover:scale-110 shadow-lg shadow-blue-500/30 animate-pulse hover:animate-none hover:shadow-blue-500/50"
                                                                            title="Save"
                                                >
                                                                            <span className="text-base block">💾</span>
                                                </button>
                                                                    ) : null}
                                            <button
                                                                        onClick={() => copyToClipboard(msg.content)}
                                                                        className="relative p-2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-lg flex-shrink-0 transition-all duration-300 hover:scale-110 shadow-lg shadow-blue-500/30 animate-pulse hover:animate-none hover:shadow-blue-500/50"
                                                                        title="Copy"
                                            >
                                                                        <span className="text-base block">📋</span>
                                            </button>
                                        </div>
                                    </div>
                            </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                        </div>
                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PreviewModal />
            <TextMessagesModal />
            <SavedClipsModal />
        </div>
    );
}
