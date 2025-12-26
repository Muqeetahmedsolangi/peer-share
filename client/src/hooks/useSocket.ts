// frontend/hooks/useSocket.ts - FIXED VERSION
import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// Backend URL - Use api.dropsos.com subdomain for backend
// Can be overridden via NEXT_PUBLIC_BACKEND_URL environment variable in Vercel
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.dropsos.com';

export function useSocket(userName: string, roomName: string = 'my-wifi-room') {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomUsers, setRoomUsers] = useState<any[]>([]);
  const [roomId, setRoomId] = useState<string>('');
  
  useEffect(() => {
    // Don't connect if no userName
    if (!userName) return;
    
    // Connect to socket server
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity, // Keep trying to reconnect indefinitely
      timeout: 20000,
      forceNew: false,
      autoConnect: true
    });
    
    socketInstance.on('connect', () => {
      console.log('✅ Connected to server!', socketInstance.id);
      setIsConnected(true);
      
      // FIXED: Join network with BOTH userName AND roomName
      socketInstance.emit('join-network', { 
        userName: userName,
        roomName: roomName  // ← THIS IS THE KEY FIX!
      });
      console.log(`📡 Joining room "${roomName}" as "${userName}"`);
    });
    
    socketInstance.on('joined-room', (data) => {
      console.log('✅ Joined room:', data);
      setRoomId(data.roomId);
    });
    
    socketInstance.on('users-update', (data) => {
      console.log('👥 Users in room:', data.users.length, data.users.map((u: any) => u.name));
      setRoomUsers(data.users);
    });
    
    socketInstance.on('user-joined', (data) => {
      console.log('🎉 New user joined:', data.userName);
    });
    
    socketInstance.on('user-left', (data) => {
      console.log('👋 User left:', data.userName);
    });
    
    socketInstance.on('existing-peers', (data) => {
      console.log('📋 Existing peers:', data.peers.length);
    });
    
    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server. Reason:', reason);
      setIsConnected(false);
      
      // If disconnect is due to transport close (like going to background), reconnect
      if (reason === 'transport close' || reason === 'ping timeout') {
        console.log('🔄 Attempting to reconnect...');
      }
    });
    
    socketInstance.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      
      // Rejoin the network after reconnection
      if (userName) {
        socketInstance.emit('join-network', { 
          userName: userName,
          roomName: roomName
        });
        console.log(`📡 Rejoining room "${roomName}" as "${userName}"`);
      }
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after all attempts');
    });
    
    setSocket(socketInstance);
    
    return () => {
      console.log('🧹 Cleaning up socket connection');
      socketInstance.disconnect();
    };
  }, [userName, roomName]);
  
  return { socket, isConnected, roomUsers, roomId };
}