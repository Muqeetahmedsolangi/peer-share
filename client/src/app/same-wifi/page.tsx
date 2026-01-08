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

    // Get file icon based on type - Returns SVG component
    const getFileIcon = (file: File) => {
        const type = file.type.toLowerCase();
        const iconClass = "w-5 h-5";
        if (type.startsWith('image/')) {
            return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
        }
        if (type.startsWith('video/')) {
            return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
        }
        if (type.startsWith('audio/')) {
            return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>;
        }
        if (type.includes('pdf')) {
            return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
        }
        if (type.includes('word') || type.includes('document')) {
            return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
        }
        if (type.includes('excel') || type.includes('spreadsheet')) {
            return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
        }
        if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) {
            return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
        }
        if (type.includes('text')) {
            return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
        }
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4"
                onClick={closePreview}
            >
                <div
                    className="relative w-full max-w-6xl max-h-[90vh] bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gray-50 p-3 sm:p-4 flex items-center justify-between border-b border-gray-200">
                        <div className="flex-1 min-w-0 mr-3">
                            <h3 className="text-gray-900 font-semibold truncate text-sm sm:text-base">{previewFile.name}</h3>
                            <p className="text-gray-500 text-xs sm:text-sm">
                                {(previewFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button
                                onClick={() => downloadFile(previewFile)}
                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                            </button>
                            <button
                                onClick={closePreview}
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Close
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
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
                onClick={() => setShowTextModal(false)}
            >
                <div
                    className="relative w-full max-w-4xl max-h-[90vh] bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gray-50 p-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-semibold text-base sm:text-lg">Messages</h3>
                                <p className="text-xs text-gray-500">{receivedMessages.length} message{receivedMessages.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowTextModal(false)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-all duration-300 hover:scale-110"
                            title="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50">
                        {receivedMessages.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
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
                                                <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm break-words overflow-hidden ${isYou
                                                        ? 'bg-orange-500 text-white rounded-tr-sm'
                                                        : 'bg-white text-gray-900 rounded-tl-sm border-2 border-gray-200'
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
                                                                className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-lg flex-shrink-0 transition-all duration-300 hover:scale-110"
                                                                title="Save"
                                                            >
                                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </button>
                                                        ) : null}
                                            <button
                                                onClick={() => copyToClipboard(msg.content)}
                                                            className="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex-shrink-0 transition-all duration-300 hover:scale-110"
                                                            title="Copy"
                                            >
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
                onClick={() => setShowClipModal(false)}
            >
                <div
                    className="relative w-full max-w-4xl max-h-[90vh] bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gray-50 p-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-semibold text-base sm:text-lg">Saved Clips</h3>
                                <p className="text-xs text-gray-500">{validClips.length} clip{validClips.length !== 1 ? 's' : ''} • expires in 30 min</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowClipModal(false)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-all duration-300 hover:scale-110"
                            title="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50">
                        {validClips.length === 0 ? (
                            <div className="text-center text-gray-500 py-16">
                                <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-base font-medium mb-2 text-gray-900">No saved clips yet</p>
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
                                            className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-orange-100 rounded-full border border-orange-200">
                                                            <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span className="text-orange-700 font-semibold text-sm">Clip #{index + 1}</span>
                                                        </div>
                                                        {clip.savedBy && (
                                                            <span className="text-xs text-gray-500">by <span className="text-orange-600 font-semibold">{clip.savedBy}</span></span>
                                                        )}
                                                        {timeAgo && (
                                                            <span className="text-xs text-gray-500">• {timeAgo}</span>
                                    )}
                                </div>
                                                    {clip.preview && (
                                                        <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                                                            <p className="text-gray-900 text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed" title={clip.preview}>
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
                                                                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium flex items-center gap-1.5"
                                                                    title="Preview File"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    Preview
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => downloadClipFile(clip.clipId, clip.fileName!, clip.fileType)}
                                                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium flex items-center gap-1.5"
                                                                title="Download File"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                                Download
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => copyClipContent(clip.clipId)}
                                                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium flex items-center gap-1.5"
                                                                title="Copy Content"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                                Copy
                                                            </button>
                                                            <button
                                                                onClick={() => getClipFromRedis(clip.clipId)}
                                                                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium flex items-center gap-1.5"
                                                                title="Load into Editor"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                </svg>
                                                                Load
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

    // Join Screen - Professional White Theme
    if (!isJoined) {
        return (
            <main className="min-h-screen bg-white pt-16 sm:pt-20">
                <section className="bg-gradient-to-b from-white via-orange-50/20 to-white py-12 sm:py-16 md:py-20">
                    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-center mb-8 sm:mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-orange-100 rounded-2xl flex items-center justify-center">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                                </svg>
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                                Same <span className="text-orange-500">WiFi</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 mb-2">
                                Join your WiFi network for instant file sharing
                            </p>
                            <p className="text-sm sm:text-base text-gray-500">
                                Share files directly between devices on the same network
                            </p>
                        </div>

                        <div className={`bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <input
                                type="text"
                                placeholder="Enter your name (optional)"
                                value={userName}
                                onChange={(e) => {
                                    setUserName(e.target.value);
                                    if (e.target.value.trim()) {
                                        saveToStorage('peershare-username', e.target.value);
                                    }
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base mb-4 transition-all duration-300"
                            />
                            <button
                                onClick={handleJoin}
                                className="w-full px-6 py-3 sm:py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
                            >
                                Join Network
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    // Main Interface - Professional White Theme
    return (
        <main className="min-h-screen bg-white pt-16 sm:pt-20">
            {/* Header */}
            <section className="bg-gradient-to-b from-white via-orange-50/20 to-white py-8 sm:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm sm:text-base">Back</span>
                        </button>

                        {/* Status Badge */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-gray-200 rounded-full shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`}></div>
                                <span className={`text-xs font-semibold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                </span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 font-medium">Users</span>
                                <span className="px-2 py-0.5 bg-orange-100 text-xs font-bold text-orange-600 rounded-full">{roomUsers.length}</span>
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
            </section>

            {/* Main Content */}
            <section className="py-8 sm:py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Users List */}
                    {roomUsers.length > 0 && (
                        <div className={`mb-6 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="flex items-center gap-4 flex-wrap px-4 py-3 bg-white border-2 border-gray-200 rounded-full shadow-sm">
                                <span className="text-sm text-gray-600 font-medium">Users:</span>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {roomUsers.map((user) => (
                                        <div
                                            key={user.socketId}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full hover:bg-orange-100 transition-all duration-300"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-sm text-gray-900 font-medium">{user.name}</span>
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
                                {/* Text/Code Sharing - Professional Design */}
                                <div className={`bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-5 shadow-lg transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    } h-[600px] flex flex-col`}>
                                    {/* Tabs */}
                                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                        <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                            <button
                                    onClick={() => setActiveTab('text')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                                        activeTab === 'text'
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Share Text
                            </button>
                                            <button
                                    onClick={() => setActiveTab('files')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                                        activeTab === 'files'
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                            >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    Share Files
                                            </button>
                                    </div>
                                        <div className="flex gap-2">
                                            {savedClipIds.length > 0 && (
                                <button
                                                    onClick={() => setShowClipModal(true)}
                                                    className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-orange-600 transition-all duration-300 flex items-center gap-1.5"
                                    >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {savedClipIds.length}
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
                                                className="w-full h-full px-4 py-3 pr-28 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm sm:text-base transition-all duration-300 font-mono"
                                            />
                                            {/* Small buttons in bottom-right corner */}
                                            <div className="absolute bottom-3 right-3 flex gap-2">
                                                <button
                                                    onClick={saveToRedis}
                                                    disabled={!textInput.trim() || !socket}
                                                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center gap-1.5"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Save</span>
                                                </button>
                            <button
                                onClick={sendTextMessage}
                                disabled={!textInput.trim()}
                                                    className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center gap-1.5"
                            >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
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
                                            ? 'border-orange-400 bg-orange-50'
                                            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/30'
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
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-900 font-semibold text-base sm:text-lg mb-1">
                                                {isDragging ? 'Drop file here' : 'Click or drag file here'}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                Maximum file size: 10MB
                                            </p>
                                        </div>
                        </div>
                    </div>

                                {/* Selected File Display - 20% when file selected */}
                                {selectedFile && (
                                    <div className="flex-[0.2] mt-3">
                                        <div className="p-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm h-full flex flex-col">
                                            {/* File Info */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center border border-orange-200">
                                                    <div className="text-orange-600">
                                                        {getFileIcon(selectedFile)}
                                                    </div>
                                                </div>
                                            <div className="flex-1 min-w-0">
                                                    <p className="text-gray-900 font-semibold truncate text-xs mb-0.5">{selectedFile.name}</p>
                                                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                            
                                            {/* Preview, Save, and Send buttons in one line */}
                                            <div className="flex gap-2 mt-auto">
                                                {canPreview(selectedFile) && (
                                                <button
                                                        onClick={() => openPreview(selectedFile)}
                                                        className="flex-1 px-2 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md text-xs font-medium flex items-center justify-center gap-1"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Preview
                                                </button>
                                            )}
                                            <button
                                                    onClick={saveFileToRedis}
                                                    disabled={!socket}
                                                    className="flex-1 px-2 py-1.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xs shadow-sm hover:shadow-md flex items-center justify-center gap-1"
                                            >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Save
                                                </button>
                                                <button
                                                    onClick={sendFileToChat}
                                                    disabled={!socket}
                                                    className="flex-1 px-2 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium flex items-center justify-center gap-1"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                    Send
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
                            <div className={`bg-white border-2 border-gray-200 rounded-2xl shadow-lg transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                } h-[600px] flex flex-col`}>
                                {/* Messages Header */}
                                <div className="bg-gray-50 p-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            </div>
                                        <div>
                                            <h3 className="text-gray-900 font-semibold text-base sm:text-lg">Messages</h3>
                                            <p className="text-xs text-gray-500">{receivedMessages.length} message{receivedMessages.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Content */}
                                <div className="flex-1 overflow-auto p-4 bg-gray-50">
                                    {receivedMessages.length === 0 ? (
                                        <div className="text-center text-gray-500 py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
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
                                                            <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm break-words overflow-hidden ${isYou
                                                                    ? 'bg-orange-500 text-white rounded-tr-sm'
                                                                    : 'bg-white text-gray-900 rounded-tl-sm border-2 border-gray-200'
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
                                                                            className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-lg flex-shrink-0 transition-all duration-300 hover:scale-110"
                                                                            title="Save"
                                                >
                                                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                </button>
                                                                    ) : null}
                                            <button
                                                                        onClick={() => copyToClipboard(msg.content)}
                                                                        className="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex-shrink-0 transition-all duration-300 hover:scale-110"
                                                                        title="Copy"
                                            >
                                                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                        </svg>
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
            </section>

            {/* Modals */}
            <PreviewModal />
            <TextMessagesModal />
            <SavedClipsModal />
        </main>
    );
}
