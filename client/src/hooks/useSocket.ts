// frontend/hooks/useSocket.ts - FIXED VERSION
import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://54.83.105.210';

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
      reconnectionAttempts: 5
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
    
    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });
    
    socketInstance.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });
    
    setSocket(socketInstance);
    
    return () => {
      console.log('🧹 Cleaning up socket connection');
      socketInstance.disconnect();
    };
  }, [userName, roomName]);
  
  return { socket, isConnected, roomUsers, roomId };
}