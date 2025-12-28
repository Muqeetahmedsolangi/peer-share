'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import io, { Socket } from 'socket.io-client';

// Backend URL
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

interface User {
  socketId: string;
  name: string;
  joinedAt: Date;
}

interface Message {
  messageId?: string;
  id: string;
  message?: string;
  text: string;
  senderName?: string;
  sender: string;
  senderId?: string;
  senderSocketId?: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system' | 'image' | 'video';
  fileData?: {
    name: string;
    size: number;
    type: string;
    icon: string;
    color: string;
    preview?: string; // Base64 or blob URL for preview
    downloadUrl?: string;
  };
}

interface TypingUser {
  userName: string;
  userId: string;
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
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  
  // Get parameters from URL or prompt user
  const [userName, setUserName] = useState(searchParams.get('name') || '');
  const [password, setPassword] = useState(searchParams.get('password') || '');
  const [isJoined, setIsJoined] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [showMobileUsers, setShowMobileUsers] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Initialize main socket connection after successful validation
  useEffect(() => {
    if (isJoined && userName && password) {
      const socketInstance = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        timeout: 20000
      });

      socketInstance.on('connect', () => {
        console.log('✅ Connected to server for room session!', socketInstance.id);
        setIsConnected(true);
        
        // Join the room - we already validated credentials
        socketInstance.emit('join-room', {
          roomId: roomId,
          password: password.trim(),
          userName: userName.trim()
        });
      });

      socketInstance.on('room-join-response', (data) => {
        if (data.success) {
          console.log('✅ Successfully joined room session:', data.room);
          setRoomInfo(data.room);
          setUsers(data.room.members || []);
          setMessages([{
            id: Date.now().toString(),
            text: `Welcome to ${data.room.name}! 🎉`,
            sender: 'System',
            timestamp: new Date(),
            type: 'system'
          }]);
        } else {
          console.error('❌ Failed to join room session:', data.error);
          // If join fails after validation, something is wrong - go back to join form
          setIsJoined(false);
          setJoinError(data.error || 'Session expired. Please try joining again.');
        }
      });

      socketInstance.on('room-users-update', (data) => {
        console.log('👥 Users updated:', data.users);
        setUsers(data.users || []);
      });

      socketInstance.on('user-joined-room', (data) => {
        console.log('🎉 New user joined:', data.userName);
        const joinMessage: Message = {
          id: Date.now().toString(),
          text: `${data.userName} joined the room`,
          sender: 'System',
          timestamp: new Date(),
          type: 'system'
        };
        setMessages(prev => [...prev, joinMessage]);
      });

      socketInstance.on('user-left-room', (data) => {
        console.log('👋 User left:', data.userName);
        const leaveMessage: Message = {
          id: Date.now().toString(),
          text: `${data.userName} left the room`,
          sender: 'System',
          timestamp: new Date(),
          type: 'system'
        };
        setMessages(prev => [...prev, leaveMessage]);
      });

      // Chat message received from other users
      socketInstance.on('room-chat-message', (data) => {
        console.log('💬 Chat message received:', data);
        // Only add if it's not from ourselves
        if (data.senderSocketId !== socketInstance.id) {
          const message: Message = {
            id: data.messageId || Date.now().toString(),
            messageId: data.messageId,
            text: data.message,
            message: data.message,
            sender: data.senderName,
            senderName: data.senderName,
            senderId: data.senderId,
            senderSocketId: data.senderSocketId,
            timestamp: new Date(data.timestamp),
            type: 'text'
          };
          setMessages(prev => [...prev, message]);
        }
      });

      // File offered by other users
      socketInstance.on('room-file-offered', (data) => {
        console.log('📁 File offered:', data);
        
        // Determine message type and create preview message for all file types
        let messageType: Message['type'] = 'file';
        let messageText = `${data.senderName} shared a file`;
        let fileIcon = '📄';
        let fileColor = 'text-gray-400';

        if (isImageFile(data.fileType)) {
          messageType = 'image';
          messageText = `${data.senderName} shared an image`;
          fileIcon = '🖼️';
          fileColor = 'text-green-400';
        } else if (isVideoFile(data.fileType)) {
          messageType = 'video';
          messageText = `${data.senderName} shared a video`;
          fileIcon = '🎥';
          fileColor = 'text-red-400';
        }

        const message: Message = {
          id: Date.now().toString(),
          text: messageText,
          sender: data.senderName,
          senderName: data.senderName,
          senderSocketId: data.senderSocketId,
          timestamp: new Date(data.timestamp),
          type: messageType,
          fileData: {
            name: data.fileName,
            size: data.fileSize,
            type: data.fileType,
            icon: fileIcon,
            color: fileColor,
            preview: data.preview
          }
        };
        setMessages(prev => [...prev, message]);
      });

      // Typing indicators
      socketInstance.on('room-user-typing', (data) => {
        if (data.isTyping) {
          setTypingUsers(prev => {
            const exists = prev.find(u => u.userId === data.userId);
            if (!exists) {
              return [...prev, { userName: data.userName, userId: data.userId }];
            }
            return prev;
          });
        } else {
          setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
        }
      });

      // WebRTC file transfer handlers
      socketInstance.on('file-transfer-offer', (data) => {
        console.log('📥 File transfer offer from:', data.senderName);
        // Handle incoming file transfer offer
        handleFileTransferOffer(data);
      });

      socketInstance.on('file-transfer-answer', (data) => {
        console.log('📤 File transfer answer received');
        // Handle file transfer answer
        handleFileTransferAnswer(data);
      });

      socketInstance.on('file-transfer-ice', (data) => {
        console.log('🧊 File transfer ICE candidate');
        // Handle ICE candidate for file transfer
        handleFileTransferICE(data);
      });

      socketInstance.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('❌ Connection error during session:', error);
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        console.log('🧹 Cleaning up socket connection');
        socketInstance.disconnect();
      };
    }
  }, [isJoined, userName, password, roomId]);

  useEffect(() => {
    setIsVisible(true);
    scrollToBottom();
  }, [messages]);

  // Load username from localStorage and check if we should auto-join
  useEffect(() => {
    const savedUsername = localStorage.getItem('peershare-username') || '';
    if (!userName && savedUsername) {
      setUserName(savedUsername);
    }
    
    // If we have both username and password from URL params, auto-join
    if (userName && password) {
      setIsJoined(true);
    }
  }, [userName, password]);

  // Close share modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareModal && !(event.target as Element).closest('.share-modal')) {
        setShowShareModal(false);
      }
    };
    
    if (showShareModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showShareModal]);

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
    if (newMessage.trim() && socket && isConnected) {
      // Add message to local state immediately
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      
      // Send via socket to other users in room
      socket.emit('room-chat-message', { 
        message: newMessage.trim(), 
        roomId: roomId 
      });
      
      setNewMessage('');
      setIsTyping(false);
      
      // Stop typing indicator
      socket.emit('room-typing', { roomId, isTyping: false });
    }
  };

  const handleJoinRoom = () => {
    // Enhanced validation with specific error messages
    if (!userName.trim()) {
      setJoinError('Please enter your name. This will be shown to other users in the room.');
      return;
    }
    
    if (userName.trim().length < 2) {
      setJoinError('Name must be at least 2 characters long.');
      return;
    }
    
    if (userName.trim().length > 50) {
      setJoinError('Name must be less than 50 characters.');
      return;
    }
    
    if (!password.trim()) {
      setJoinError('Please enter the room password.');
      return;
    }
    
    // Don't set isJoined=true yet - wait for server validation
    setJoinError('');
    setIsJoining(true);
    
    // Save to localStorage
    localStorage.setItem('peershare-username', userName.trim());
    
    // Start the connection process - socket will validate credentials
    initiateJoinProcess();
  };

  const initiateJoinProcess = () => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: false, // Don't auto-reconnect for initial validation
      timeout: 10000
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to server for validation');
      
      // Send join request with credentials for validation
      socketInstance.emit('join-room', {
        roomId: roomId,
        password: password.trim(),
        userName: userName.trim()
      });
    });

    socketInstance.on('room-join-response', (data) => {
      setIsJoining(false);
      if (data.success) {
        console.log('✅ Room validation successful');
        setIsJoined(true); // Now we can join
        socketInstance.disconnect(); // Clean up validation socket
      } else {
        console.error('❌ Room validation failed:', data.error);
        setJoinError(data.error || 'Invalid room ID or password. Please check your credentials.');
        socketInstance.disconnect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsJoining(false);
      setJoinError('Cannot connect to server. Please try again.');
    });

    socketInstance.on('disconnect', (reason) => {
      if (reason === 'io client disconnect') {
        // Normal disconnect after validation
        return;
      }
      console.error('❌ Disconnected during validation:', reason);
      if (!isJoined) {
        setIsJoining(false);
        setJoinError('Connection lost. Please try again.');
      }
    });
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Share room functionality
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${label} copied to clipboard!`);
      showNotification(`${label} copied to clipboard!`, 'success');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  const shareRoom = () => {
    setShowShareModal(true);
  };

  const getRoomLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/join-room?roomId=${roomId}`;
  };


  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join Room: ${roomInfo?.name || roomId}`,
          text: `Join my secure room! Room ID: ${roomId}`,
          url: getRoomLink()
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying link
      copyToClipboard(getRoomLink(), 'Room link');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicators
    if (socket && isConnected) {
      if (e.target.value.trim() && !isTyping) {
        setIsTyping(true);
        socket.emit('room-typing', { roomId, isTyping: true });
      } else if (!e.target.value.trim() && isTyping) {
        setIsTyping(false);
        socket.emit('room-typing', { roomId, isTyping: false });
      }
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };


  // New handler for chat input - automatically shares files
  const handleChatFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    setIsUploadingFiles(true);
    
    try {
      // Automatically share each selected file
      for (const file of files) {
        await handleFileShare(file);
      }
    } catch (error) {
      console.error('Error sharing files:', error);
    } finally {
      setIsUploadingFiles(false);
      // Clear the input so same file can be selected again
      e.target.value = '';
    }
  };

  const handleFileShare = async (file: File) => {
    if (!socket || !isConnected) return;
    
    const fileType = getFileType(file);
    
    try {
      let messageType: Message['type'] = 'file';
      let preview: string | undefined;
      
      // Create preview for images and videos
      if (isImageFile(file.type)) {
        messageType = 'image';
        preview = await createFilePreview(file);
      } else if (isVideoFile(file.type)) {
        messageType = 'video';
        preview = await createFilePreview(file);
      }
      
      // Add local message with preview
      const message: Message = {
        id: Date.now().toString(),
        text: isImageFile(file.type) ? 'Shared an image' : isVideoFile(file.type) ? 'Shared a video' : `Shared file: ${file.name}`,
        sender: 'You',
        timestamp: new Date(),
        type: messageType,
        fileData: {
          name: file.name,
          size: file.size,
          type: file.type,
          icon: fileType.icon,
          color: fileType.color,
          preview: preview
        }
      };
      setMessages(prev => [...prev, message]);
      
      // Announce file availability to room with preview for images/videos
      const fileOfferData: any = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        roomId: roomId
      };
      
      // Include preview for media files
      if (preview && (isImageFile(file.type) || isVideoFile(file.type))) {
        fileOfferData.preview = preview;
      }
      
      socket.emit('room-file-offer', fileOfferData);
      
      // Store file for potential P2P transfer
      (window as any).pendingFiles = (window as any).pendingFiles || {};
      (window as any).pendingFiles[file.name] = file;
      
    } catch (error) {
      console.error('Error creating file preview:', error);
      
      // Fallback to regular file sharing if preview fails
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
      setMessages(prev => [...prev, message]);
      
      socket.emit('room-file-offer', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        roomId: roomId
      });
      
      (window as any).pendingFiles = (window as any).pendingFiles || {};
      (window as any).pendingFiles[file.name] = file;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper functions for media detection
  const isImageFile = (fileType: string): boolean => {
    return fileType.startsWith('image/');
  };

  const isVideoFile = (fileType: string): boolean => {
    return fileType.startsWith('video/');
  };

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // For images and videos, read as data URL for preview
      if (isImageFile(file.type) || isVideoFile(file.type)) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  // WebRTC file transfer functions
  const handleFileTransferOffer = async (data: any) => {
    try {
      console.log('📤 Handling file transfer offer for:', data.fileName, 'from:', data.senderName);
      
      // Check if we have the file
      const file = (window as any).pendingFiles?.[data.fileName];
      if (!file) {
        console.error('❌ File not found for sending:', data.fileName);
        console.log('Available files:', Object.keys((window as any).pendingFiles || {}));
        return;
      }
      
      console.log('✅ File found, setting up WebRTC connection...');
      
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('file-transfer-ice', {
            candidate: event.candidate,
            targetSocketId: data.senderSocketId
          });
        }
      };

      // Create data channel for sending file
      const channel = peerConnection.createDataChannel('fileTransfer');
      
      // When channel opens, send the requested file
      channel.onopen = async () => {
        console.log('📤 Sending file:', data.fileName);
        
        // Get the file from pending files
        const file = (window as any).pendingFiles?.[data.fileName];
        if (!file) {
          console.error('File not found for sending:', data.fileName);
          return;
        }

        try {
          // Send file info first
          const fileInfo = {
            type: 'file-info',
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          };
          channel.send(JSON.stringify(fileInfo));

          // Read and send file in chunks
          const chunkSize = 16384; // 16KB chunks
          const arrayBuffer = await file.arrayBuffer();
          const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);
          
          console.log(`📦 Sending ${totalChunks} chunks for ${file.name}`);
          
          for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
            const chunk = arrayBuffer.slice(start, end);
            
            // Wait for channel buffer if needed
            while (channel.bufferedAmount > 65536) {
              await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            channel.send(chunk);
          }

          // Send completion message
          const completeInfo = {
            type: 'file-complete',
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
          };
          channel.send(JSON.stringify(completeInfo));
          
          console.log('✅ File sent successfully:', file.name);
          
        } catch (error) {
          console.error('Error sending file:', error);
        }
      };

      // Set remote description
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      
      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send answer
      if (socket) {
        socket.emit('file-transfer-answer', {
          answer: answer,
          targetSocketId: data.senderSocketId
        });
      }

      // Store connection for ICE candidates
      (window as any).fileConnections = (window as any).fileConnections || {};
      (window as any).fileConnections[data.senderSocketId] = peerConnection;

    } catch (error) {
      console.error('Error handling file transfer offer:', error);
    }
  };

  const handleFileTransferAnswer = async (data: any) => {
    try {
      const peerConnection = (window as any).fileConnections?.[data.senderSocketId];
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    } catch (error) {
      console.error('Error handling file transfer answer:', error);
    }
  };

  const handleFileTransferICE = async (data: any) => {
    try {
      const peerConnection = (window as any).fileConnections?.[data.senderSocketId];
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (error) {
      console.error('Error handling file transfer ICE:', error);
    }
  };

  const downloadFileFromPeer = async (fileInfo: { 
    fileShareId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    senderName: string;
    senderId: string;
    senderSocketId: string;
    timestamp: number;
  }) => {
    if (!socket) return;

    console.log('🔄 Starting download request for:', fileInfo.fileName);
    console.log('🔍 File info:', fileInfo);

    // Check if this is our own file (we can download directly)
    if (fileInfo.senderName === 'You' || fileInfo.senderSocketId === socket.id) {
      console.log('📁 Downloading own file directly...');
      const file = (window as any).pendingFiles?.[fileInfo.fileName];
      if (file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileInfo.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('✅ Own file downloaded successfully!');
        return;
      } else {
        console.error('❌ Own file not found in pending files');
      }
    }

    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Handle ICE candidates  
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('file-transfer-ice', {
            candidate: event.candidate,
            targetSocketId: fileInfo.senderSocketId
          });
        }
      };

      // Handle incoming data channel from sender
      peerConnection.ondatachannel = (event) => {
        console.log('📡 Data channel received from sender');
        const channel = event.channel;
        const chunks: ArrayBuffer[] = [];
        let fileName = fileInfo.fileName;
        let fileType = fileInfo.fileType;
        
        channel.onopen = () => {
          console.log('📡 Data channel opened, ready to receive file');
        };
        
        channel.onmessage = (event) => {
          if (typeof event.data === 'string') {
            const data = JSON.parse(event.data);
            console.log('📨 Received message:', data.type);
            
            if (data.type === 'file-info') {
              fileName = data.fileName;
              fileType = data.fileType;
              console.log('📥 Receiving file:', fileName, 'Type:', fileType);
            } else if (data.type === 'file-complete') {
              console.log('✅ File transfer completed:', fileName, 'Chunks received:', chunks.length);
              
              // Create blob and download
              const blob = new Blob(chunks, { type: fileType });
              const url = URL.createObjectURL(blob);
              
              console.log('💾 Creating download for:', fileName, 'Size:', blob.size, 'bytes');
              
              const a = document.createElement('a');
              a.href = url;
              a.download = fileName;
              document.body.appendChild(a); // Add to DOM for better compatibility
              a.click();
              document.body.removeChild(a); // Clean up
              
              URL.revokeObjectURL(url);
              console.log('🎉 Download triggered successfully!');
            }
          } else {
            // File chunk
            chunks.push(event.data);
            console.log(`📦 Received chunk ${chunks.length}, size:`, event.data.byteLength);
          }
        };
        
        channel.onerror = (error) => {
          console.error('❌ Data channel error:', error);
        };
      };
      
      // Create offer as receiver
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Add connection state logging
      peerConnection.onconnectionstatechange = () => {
        console.log('🔗 Connection state:', peerConnection.connectionState);
      };
      
      peerConnection.oniceconnectionstatechange = () => {
        console.log('🧊 ICE connection state:', peerConnection.iceConnectionState);
      };

      // Send offer to file sender
      console.log('📤 Sending file transfer offer to:', fileInfo.senderSocketId);
      socket.emit('file-transfer-offer', {
        offer: offer,
        fileName: fileInfo.fileName,
        targetSocketId: fileInfo.senderSocketId
      });

      // Store connection for handling answer/ICE
      (window as any).fileConnections = (window as any).fileConnections || {};
      (window as any).fileConnections[fileInfo.senderSocketId] = peerConnection;
      
      console.log('⏰ Waiting for file sender to respond...');

    } catch (error) {
      console.error('Error starting file download:', error);
    }
  };


  // Show join form if not joined yet
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Join Room
                </span>
              </h1>
              <div className="px-2">
                <p className="text-sm sm:text-base md:text-lg text-gray-300 font-light mb-2">
                  Room ID: <span className="font-mono font-bold text-blue-400">{roomId}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Please enter your name and the room password to join
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
              {joinError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                  <p className="text-red-300 text-sm">{joinError}</p>
                </div>
              )}
              
              <div className="space-y-5">
                {/* User Name Section - Enhanced */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <label className="block text-sm font-semibold text-blue-300">
                      Your Name (Required)
                    </label>
                  </div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your display name for the room..."
                    className="w-full px-4 py-3 bg-slate-800/70 border border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-300"
                    maxLength={50}
                    autoFocus
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-blue-200 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>This name will be shown to other users</span>
                    </p>
                    <span className={`text-xs ${userName.length > 40 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {userName.length}/50
                    </span>
                  </div>
                </div>
                
                {/* Room Password Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Room Password</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter room password..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all duration-300"
                  />
                </div>
                
                {/* Information Box */}
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-cyan-300 font-semibold mb-1 text-sm">What happens next?</h4>
                      <ul className="text-xs text-cyan-200 space-y-1">
                        <li>• Your name will appear to other users in the room</li>
                        <li>• You'll see who else is connected in real-time</li>
                        <li>• You can chat and share files securely</li>
                        <li>• Your credentials are validated before joining</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleJoinRoom}
                  disabled={!userName.trim() || userName.trim().length < 2 || !password.trim() || isJoining}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 text-sm sm:text-base flex items-center justify-center"
                >
                  {isJoining ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining Room...
                    </>
                  ) : (
                    'Join Room'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* VIEWPORT FIX - COMPLETE SOLUTION */}
      <style jsx global>{`
        html, body, #__next {
          margin: 0;
          padding: 0;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          position: fixed;
          width: 100%;
        }
        .room-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
        }
        .header-safe-area {
          padding-top: max(env(safe-area-inset-top, 44px), 70px);
        }
        @media (min-width: 768px) {
          .header-safe-area {
            padding-top: max(env(safe-area-inset-top, 20px), 80px);
          }
        }
      `}</style>
      <div className="room-wrapper">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* HEADER WITH SAFE AREA PADDING */}
        <div className={`header-safe-area relative z-20 pb-3 md:pb-4 border-b border-white/10 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Desktop Header Layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left Side - Back Button & Room Info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="group flex items-center text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 px-3 py-2 rounded-lg"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'} shadow-lg ${isConnected ? 'shadow-green-400/50' : 'shadow-red-400/50'}`}></div>
                <div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Room #{roomId}
                  </h1>
                  <p className="text-sm text-gray-400">
                    {roomInfo?.name || `Secure P2P Room`}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Desktop Actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop Users Display */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-lg backdrop-blur-sm">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-green-300 font-medium">
                  {users.length} {users.length === 1 ? 'user' : 'users'} online
                </span>
              </div>
              
              {/* Desktop Share Button */}
              <button 
                onClick={shareRoom}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
                title="Share room"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share Room</span>
              </button>
              
              {/* Desktop Leave Button */}
              <button 
                onClick={() => router.back()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center space-x-2"
                title="Leave room"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
                <span>Leave Room</span>
              </button>
            </div>
          </div>

          {/* Mobile Header Layout */}
          <div className="flex md:hidden items-center justify-between">
            {/* Left Side - Back Button & Room Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <button
                onClick={() => router.back()}
                className="group flex items-center text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 p-2 rounded-full"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'} shadow-lg ${isConnected ? 'shadow-green-400/50' : 'shadow-red-400/50'}`}></div>
                <h1 className="text-lg font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
                  Room #{roomId}
                </h1>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Users Count - Clickable */}
              <button
                onClick={() => setShowMobileUsers(true)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/20 border border-green-400/30 rounded-full backdrop-blur-sm hover:bg-green-500/30 transition-all duration-300 active:scale-95"
              >
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300 font-medium">
                  {users.length}
                </span>
                <svg className="w-3 h-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              
              {/* Mobile Share Button */}
              <button 
                onClick={shareRoom}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                title="Share room"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              
              {/* Mobile Leave Button */}
              <button 
                onClick={() => router.back()}
                className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                title="Leave room"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* SIMPLE CONTENT AREA */}
        <div className="relative z-10 h-full overflow-hidden">
          <div className="w-full max-w-7xl mx-auto h-full px-2 md:px-4 lg:px-6">
            <div className="flex flex-col lg:flex-row h-full gap-3 md:gap-4 lg:gap-6 py-2 md:py-4">
            
            {/* Responsive Chat Area */}
            <div className={`flex-1 flex flex-col bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-xl md:rounded-2xl transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              
              {/* Messages Area - Responsive */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4 scroll-smooth">
                {messages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'} transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] px-4 md:px-5 py-3 md:py-4 rounded-2xl transition-all duration-300 ${
                      message.type === 'system' 
                        ? 'bg-blue-500/20 text-blue-300 text-center mx-auto border border-blue-400/30 rounded-xl text-sm md:text-base'
                        : message.sender === 'You'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02]'
                        : 'bg-slate-700/90 text-gray-200 border border-slate-600/50 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl hover:bg-slate-700 transform hover:scale-[1.02]'
                    }`}>
                      {message.type !== 'system' && (
                        <div className="text-xs font-semibold mb-1 opacity-80 flex items-center space-x-1">
                          <span>{message.sender}</span>
                          {message.sender === 'You' && (
                            <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      )}
                      {/* Text message */}
                      {message.type === 'text' && (
                        <div className="text-sm sm:text-base break-words leading-relaxed">{message.text}</div>
                      )}
                      
                      {/* System message */}
                      {message.type === 'system' && (
                        <div className="text-sm sm:text-base break-words leading-relaxed">{message.text}</div>
                      )}

                      {/* Image preview - WhatsApp style */}
                      {message.type === 'image' && message.fileData && (
                        <div className="mt-1">
                          <div className="relative rounded-lg overflow-hidden max-w-xs sm:max-w-sm bg-slate-800 group">
                            {message.fileData.preview ? (
                              <img 
                                src={message.fileData.preview} 
                                alt={message.fileData.name}
                                className="w-full h-auto max-h-64 object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                onClick={() => {
                                  // Open full size image
                                  const fullSizeWindow = window.open();
                                  if (fullSizeWindow) {
                                    fullSizeWindow.document.write(`
                                      <html>
                                        <head><title>${message.fileData.name}</title></head>
                                        <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh;">
                                          <img src="${message.fileData.preview}" style="max-width:100%; max-height:100%; object-fit:contain;" alt="${message.fileData.name}"/>
                                        </body>
                                      </html>
                                    `);
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-32 flex items-center justify-center bg-slate-700">
                                <span className="text-4xl">🖼️</span>
                              </div>
                            )}
                            
                            {/* Download button overlay - positioned in top right for better access */}
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent opening full image
                                  console.log('🔽 Image download button clicked:', message.fileData?.name);
                                  downloadFileFromPeer({ 
                                    fileShareId: message.id,
                                    fileName: message.fileData!.name,
                                    fileSize: message.fileData!.size,
                                    fileType: message.fileData!.type,
                                    senderName: message.sender,
                                    senderId: message.senderId || '',
                                    senderSocketId: message.senderSocketId || '',
                                    timestamp: message.timestamp.getTime()
                                  });
                                }}
                                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 text-gray-800 shadow-lg border border-gray-200 hover:shadow-xl"
                                title="Download image"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Image info overlay - bottom left */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <div className="text-white">
                                <div className="text-xs font-medium truncate pr-12">{message.fileData.name}</div>
                                <div className="text-xs opacity-75">{formatFileSize(message.fileData.size)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Video preview - WhatsApp style */}
                      {message.type === 'video' && message.fileData && (
                        <div className="mt-1">
                          <div className="relative rounded-lg overflow-hidden max-w-xs sm:max-w-sm bg-slate-800 group">
                            {message.fileData.preview ? (
                              <video 
                                src={message.fileData.preview}
                                className="w-full h-auto max-h-64 object-cover"
                                controls
                                preload="metadata"
                                poster={message.fileData.preview}
                              >
                                Your browser does not support video playback.
                              </video>
                            ) : (
                              <div className="w-full h-32 flex items-center justify-center bg-slate-700">
                                <div className="text-center">
                                  <span className="text-4xl block mb-2">🎥</span>
                                  <span className="text-xs text-gray-300">Video</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Download button overlay - positioned in top right for better access */}
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={() => {
                                  console.log('🔽 Video download button clicked:', message.fileData?.name);
                                  downloadFileFromPeer({ 
                                    fileShareId: message.id,
                                    fileName: message.fileData!.name,
                                    fileSize: message.fileData!.size,
                                    fileType: message.fileData!.type,
                                    senderName: message.sender,
                                    senderId: message.senderId || '',
                                    senderSocketId: message.senderSocketId || '',
                                    timestamp: message.timestamp.getTime()
                                  });
                                }}
                                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 text-gray-800 shadow-lg border border-gray-200 hover:shadow-xl"
                                title="Download video"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Video info overlay - bottom left */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <div className="text-white">
                                <div className="text-xs font-medium truncate pr-12">{message.fileData.name}</div>
                                <div className="text-xs opacity-75">{formatFileSize(message.fileData.size)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Regular file */}
                      {message.type === 'file' && message.fileData && (
                        <div className="mt-2 p-3 bg-slate-600/50 rounded-lg hover:bg-slate-600/70 transition-colors duration-300">
                          <div className="flex items-center space-x-3">
                            <span className={`text-2xl ${message.fileData.color}`}>{message.fileData.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">{message.fileData.name}</div>
                              <div className="text-xs text-gray-400">{formatFileSize(message.fileData.size)}</div>
                            </div>
                            <button
                              onClick={() => {
                                console.log('🔽 File download button clicked:', message.fileData?.name);
                                downloadFileFromPeer({ 
                                  fileShareId: message.id,
                                  fileName: message.fileData!.name,
                                  fileSize: message.fileData!.size,
                                  fileType: message.fileData!.type,
                                  senderName: message.sender,
                                  senderId: message.senderId || '',
                                  senderSocketId: message.senderSocketId || '',
                                  timestamp: message.timestamp.getTime()
                                });
                              }}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors duration-200 font-medium"
                            >
                              Download
                            </button>
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

                {/* Typing Indicators */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 bg-slate-700/60 text-gray-300 rounded-lg border border-slate-600/50">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs">
                          {typingUsers.length === 1 
                            ? `${typingUsers[0].userName} is typing...`
                            : `${typingUsers.length} users are typing...`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                
                <div ref={messagesEndRef} />
              </div>

              {/* Responsive Message Input */}
              <div className="p-3 md:p-4 lg:p-6 border-t border-white/10 bg-slate-800/30 backdrop-blur-sm">
                <div className="flex flex-col space-y-3 md:space-y-4">
                  {/* Responsive Emoji Picker */}
                  {showEmojiPicker && (
                    <div 
                      ref={emojiPickerRef}
                      className="bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-xl p-4 max-h-40 md:max-h-48 lg:max-h-56 overflow-y-auto shadow-2xl"
                    >
                      <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                        {commonEmojis.slice(0, 40).map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-xl hover:bg-white/20 rounded-lg p-2 md:p-3 transition-all duration-200 active:scale-95 hover:scale-110"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Beautiful Responsive Input Row */}
                  <div className="flex items-center space-x-3">
                    {/* Input Container with File Button Inside */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="w-full pl-5 pr-12 py-4 bg-slate-800/90 border-2 border-blue-500/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-base transition-all duration-300 focus:bg-slate-800/95 focus:shadow-lg focus:shadow-blue-500/20"
                      />
                      
                      {/* File Button Inside Input - Right Corner */}
                      <input
                        type="file"
                        onChange={handleChatFileSelect}
                        multiple
                        disabled={isUploadingFiles}
                        className="hidden"
                        id="chat-file-upload"
                      />
                      <label
                        htmlFor="chat-file-upload"
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
                          isUploadingFiles
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'hover:bg-slate-600/50 text-gray-400 hover:text-white'
                        } ${isUploadingFiles ? 'cursor-not-allowed' : ''}`}
                        title={isUploadingFiles ? "Uploading files..." : "Attach file"}
                      >
                        {isUploadingFiles ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        )}
                      </label>
                    </div>
                    
                    {/* Small Emoji Button */}
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-3 bg-slate-700/80 hover:bg-amber-500 text-white rounded-full transition-all duration-300 active:scale-95 border border-white/10 hover:border-amber-400/30 shadow-md hover:shadow-lg hover:shadow-amber-500/25"
                      title="Add emoji"
                    >
                      <span className="text-base">😊</span>
                    </button>
                    
                    {/* Attractive Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={`p-3 rounded-full transition-all duration-300 active:scale-95 ${
                        !newMessage.trim() 
                          ? 'bg-slate-600/70 border border-slate-500/50 text-slate-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-500/30 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-110 hover:-rotate-12'
                      }`}
                      title="Send message"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Sidebar - Hidden on Mobile */}
            <div className={`hidden lg:flex lg:w-72 flex-shrink-0 flex-col space-y-4 transition-all duration-1000 delay-500 ${
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
                    {users.length}
                  </div>
                </h3>
                <div className="space-y-2">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <div 
                        key={user.socketId || `user-${index}`} 
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300 hover:scale-105 bg-green-500/5 border border-green-500/20"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50 transition-all duration-300"></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate flex items-center space-x-1">
                            <span>{user.name}</span>
                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                          <div className="text-xs text-gray-400 flex items-center space-x-1">
                            <span>Online</span>
                            <span className="text-green-400">●</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-gray-400 text-sm">
                        {isConnected ? 'No other users connected' : 'Connecting...'}
                      </div>
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

      {/* Mobile Users Modal */}
      {showMobileUsers && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end lg:hidden">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowMobileUsers(false)}
          ></div>
          <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 border-t border-white/10 rounded-t-3xl p-6 shadow-2xl transform translate-y-0 transition-all duration-300 ease-out max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Connected Users</h3>
                  <p className="text-sm text-gray-400">{users.length} online</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileUsers(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Users List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <div 
                    key={user.socketId || `user-${index}`} 
                    className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20 backdrop-blur-sm"
                  >
                    <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-white truncate">{user.name}</div>
                      <div className="text-sm text-green-300 flex items-center space-x-2">
                        <span>Online</span>
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-green-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-gray-400 text-lg font-medium">
                    {isConnected ? 'No other users connected' : 'Connecting...'}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    Share the room link to invite others
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Room Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="share-modal bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Share Room</h3>
                  <p className="text-sm text-gray-400">{roomInfo?.name || `Room ${roomId}`}</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success Message */}
            {copySuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-300 text-sm text-center">{copySuccess}</p>
              </div>
            )}

            {/* Share Options */}
            <div className="space-y-4">
              {/* Room ID */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Room ID</label>
                  <button
                    onClick={() => copyToClipboard(roomId, 'Room ID')}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="font-mono text-lg text-white bg-slate-800/50 px-3 py-2 rounded-lg border border-white/10">
                  {roomId}
                </div>
                <p className="text-xs text-gray-400 mt-2">Share this ID with others to join the room</p>
              </div>

              {/* Join Page Link */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Join Page Link</label>
                  <button
                    onClick={() => copyToClipboard(getRoomLink(), 'Join link')}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-white bg-slate-800/50 px-3 py-2 rounded-lg border border-white/10 break-all">
                  {getRoomLink()}
                </div>
                <p className="text-xs text-gray-400 mt-2">Direct link to join page - requires room ID and password</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={shareViaWebShare}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Share Link</span>
                </button>
                <button
                  onClick={() => copyToClipboard(getRoomLink(), 'Room link')}
                  className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Link</span>
                </button>
              </div>

              {/* Security Notice */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-amber-300 font-semibold mb-1 text-sm">Security Notice</h4>
                    <p className="text-xs text-amber-200">
                      Users will still need the room password to join. Only share with trusted people.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div> {/* Close room-container */}
    </div>
  );
}