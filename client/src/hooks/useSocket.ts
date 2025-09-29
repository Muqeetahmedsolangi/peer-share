// frontend/hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export function useSocket(userName: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomUsers, setRoomUsers] = useState<any[]>([]);
  const [roomId, setRoomId] = useState<string>('');
  
  useEffect(() => {
    // Connect to socket server
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
    });
    
    socketInstance.on('connect', () => {
      console.log('Connected to server!');
      setIsConnected(true);
      // Join network/room automatically
      socketInstance.emit('join-network', userName);
    });
    
    socketInstance.on('joined-room', (data) => {
      console.log('Joined room:', data);
      setRoomId(data.roomId);
    });
    
    socketInstance.on('users-update', (data) => {
      console.log('Users in room:', data);
      setRoomUsers(data.users);
    });
    
    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });
    
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
    };
  }, [userName]);
  
  return { socket, isConnected, roomUsers, roomId };
}