// backend/services/socketService.ts
import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

// Store rooms based on network (WiFi)
const rooms = new Map<string, Set<string>>(); // roomId -> Set of socketIds
const users = new Map<string, UserInfo>(); // socketId -> user info
const networkRooms = new Map<string, string>(); // publicIP -> roomId

interface UserInfo {
  id: string;
  socketId: string;
  roomId: string;
  publicIP: string;
  name: string;
}

interface FileShare {
  id: string;
  fileName: string;
  fileSize: number;
  senderId: string;
  senderName: string;
  roomId: string;
}

export function initializeSocket(server: HttpServer) {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('✅ New user connected:', socket.id);
    
    // Get user's public IP (this determines their network/WiFi)
    const publicIP = socket.handshake.headers['x-forwarded-for'] || 
                    socket.handshake.address || 
                    'localhost';
    
    // Step 1: User joins their WiFi-based room
    socket.on('join-network', (userName: string) => {
      console.log(`👤 ${userName} joining from IP: ${publicIP}`);
      
      // Create or get room for this network
      let roomId = networkRooms.get(String(publicIP));
      if (!roomId) {
        roomId = `room-${uuidv4()}`;
        networkRooms.set(String(publicIP), roomId);
        rooms.set(roomId, new Set());
      }
      
      // Add user to room
      socket.join(roomId);
      rooms.get(roomId)?.add(socket.id);
      
      // Store user info
      const userInfo: UserInfo = {
        id: uuidv4(),
        socketId: socket.id,
        roomId: roomId,
        publicIP: String(publicIP),
        name: userName || `User-${socket.id.slice(0, 4)}`
      };
      users.set(socket.id, userInfo);
      
      // Send room info back to user
      socket.emit('joined-room', {
        roomId: roomId,
        userId: userInfo.id,
        userName: userInfo.name
      });
      
      // Get all users in same network/room
      const roomUsers = Array.from(rooms.get(roomId) || [])
        .map(sid => users.get(sid))
        .filter(Boolean);
      
      // Send updated user list to everyone in room
      io.to(roomId).emit('users-update', {
        users: roomUsers,
        totalCount: roomUsers.length
      });
      
      // Notify others that new user joined
      socket.to(roomId).emit('user-joined', {
        userId: userInfo.id,
        userName: userInfo.name
      });
    });
    
    // Step 2: Handle WebRTC signaling for P2P connection
    socket.on('webrtc-offer', (data: any) => {
      console.log('📡 WebRTC offer from:', socket.id, 'to:', data.targetSocketId);
      socket.to(data.targetSocketId).emit('webrtc-offer', {
        offer: data.offer,
        senderSocketId: socket.id
      });
    });
    
    socket.on('webrtc-answer', (data: any) => {
      console.log('📡 WebRTC answer from:', socket.id, 'to:', data.targetSocketId);
      socket.to(data.targetSocketId).emit('webrtc-answer', {
        answer: data.answer,
        senderSocketId: socket.id
      });
    });
    
    socket.on('webrtc-ice-candidate', (data: any) => {
      socket.to(data.targetSocketId).emit('webrtc-ice-candidate', {
        candidate: data.candidate,
        senderSocketId: socket.id
      });
    });
    
    // Step 3: Handle file sharing notification
    socket.on('file-share-start', (data: any) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      const fileShare: FileShare = {
        id: uuidv4(),
        fileName: data.fileName,
        fileSize: data.fileSize,
        senderId: socket.id,
        senderName: user.name,
        roomId: user.roomId
      };
      
      // Only notify users in the same room (same WiFi)
      socket.to(user.roomId).emit('file-available', fileShare);
      console.log(`📁 File shared: ${data.fileName} in room: ${user.roomId}`);
    });
    
    // Step 4: Handle disconnection
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
      
      const user = users.get(socket.id);
      if (user) {
        // Remove from room
        rooms.get(user.roomId)?.delete(socket.id);
        
        // Notify others in room
        socket.to(user.roomId).emit('user-left', {
          userId: user.id,
          userName: user.name
        });
        
        // Update user list for room
        const roomUsers = Array.from(rooms.get(user.roomId) || [])
          .map(sid => users.get(sid))
          .filter(Boolean);
        
        io.to(user.roomId).emit('users-update', {
          users: roomUsers,
          totalCount: roomUsers.length
        });
        
        // Clean up
        users.delete(socket.id);
        
        // Remove room if empty
        if (rooms.get(user.roomId)?.size === 0) {
          rooms.delete(user.roomId);
          // Find and remove from networkRooms
          for (const [ip, rid] of networkRooms.entries()) {
            if (rid === user.roomId) {
              networkRooms.delete(ip);
              break;
            }
          }
        }
      }
    });
  });
  
  console.log('🔌 Socket.IO initialized successfully!');
  return io;
}