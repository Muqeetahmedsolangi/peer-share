// backend/services/socketService.ts - COMPLETE VERSION WITH TEXT MESSAGING
import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

// Store rooms - NOW BASED ON USER-PROVIDED ROOM NAME, NOT IP
const rooms = new Map<string, Set<string>>(); // roomId -> Set of socketIds
const users = new Map<string, UserInfo>(); // socketId -> user info

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
      origin: "*", // Allow all origins for local network testing
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('✅ New user connected:', socket.id);
    
    // Get user's IP for logging purposes only
    const publicIP = socket.handshake.headers['x-forwarded-for'] || 
                    socket.handshake.address || 
                    'localhost';
    
    // User joins by ROOM NAME, not by IP
    socket.on('join-network', (data: { userName: string; roomName?: string }) => {
      const userName = data.userName || 'Anonymous';
      const roomName = data.roomName || 'default-wifi-room'; // User specifies room name
      
      console.log(`👤 ${userName} joining room "${roomName}" from IP: ${publicIP}`);
      
      // Create room if it doesn't exist
      if (!rooms.has(roomName)) {
        rooms.set(roomName, new Set());
        console.log(`🏠 Created new room: ${roomName}`);
      }
      
      // Add user to room
      socket.join(roomName);
      rooms.get(roomName)?.add(socket.id);
      
      // Store user info
      const userInfo: UserInfo = {
        id: uuidv4(),
        socketId: socket.id,
        roomId: roomName,
        publicIP: String(publicIP),
        name: userName
      };
      users.set(socket.id, userInfo);
      
      // Send room info back to user
      socket.emit('joined-room', {
        roomId: roomName,
        userId: userInfo.id,
        userName: userInfo.name
      });
      
      // Get all users in same room
      const roomUsers = Array.from(rooms.get(roomName) || [])
        .map(sid => users.get(sid))
        .filter(Boolean);
      
      console.log(`📊 Room "${roomName}" now has ${roomUsers.length} users:`, 
        roomUsers.map(u => u?.name).join(', '));
      
      // Send updated user list to everyone in room
      io.to(roomName).emit('users-update', {
        users: roomUsers,
        totalCount: roomUsers.length
      });
      
      // Notify others that new user joined
      socket.to(roomName).emit('user-joined', {
        userId: userInfo.id,
        userName: userInfo.name,
        socketId: socket.id
      });
      
      // Send list of existing peers to the new user
      const existingPeers = roomUsers
        .filter(u => u && u.socketId !== socket.id)
        .map(u => ({
          userId: u!.id,
          userName: u!.name,
          socketId: u!.socketId
        }));
      
      socket.emit('existing-peers', {
        peers: existingPeers
      });
    });
    
    // Handle WebRTC signaling for P2P connection
    socket.on('webrtc-offer', (data: any) => {
      console.log('📡 WebRTC offer from:', socket.id, 'to:', data.targetSocketId);
      io.to(data.targetSocketId).emit('webrtc-offer', {
        offer: data.offer,
        senderSocketId: socket.id
      });
    });
    
    socket.on('webrtc-answer', (data: any) => {
      console.log('📡 WebRTC answer from:', socket.id, 'to:', data.targetSocketId);
      io.to(data.targetSocketId).emit('webrtc-answer', {
        answer: data.answer,
        senderSocketId: socket.id
      });
    });
    
    socket.on('webrtc-ice-candidate', (data: any) => {
      console.log('🧊 ICE candidate from:', socket.id, 'to:', data.targetSocketId);
      io.to(data.targetSocketId).emit('webrtc-ice-candidate', {
        candidate: data.candidate,
        senderSocketId: socket.id
      });
    });
    
    // Handle file sharing notification
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
      
      // Only notify users in the same room
      socket.to(user.roomId).emit('file-available', fileShare);
      console.log(`📁 File shared: ${data.fileName} in room: ${user.roomId}`);
    });
    
    // NEW: Handle text/code message sharing
    socket.on('text-message', (data: any) => {
      const user = users.get(socket.id);
      if (!user) {
        console.log('⚠️ User not found for socket:', socket.id);
        return;
      }
      
      const messageType = data.isCode ? 'Code' : 'Text';
      console.log(`💬 ${messageType} message from ${user.name} in room: ${user.roomId}`);
      console.log(`   Content preview: ${data.content.substring(0, 50)}...`);
      
      // Broadcast to all users in the same room EXCEPT the sender
      socket.to(user.roomId).emit('text-message', {
        content: data.content,
        senderName: user.name,
        senderId: socket.id,
        isCode: data.isCode || false,
        timestamp: Date.now()
      });
      
      console.log(`✅ Message broadcasted to room: ${user.roomId}`);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
      
      const user = users.get(socket.id);
      if (user) {
        // Remove from room
        rooms.get(user.roomId)?.delete(socket.id);
        
        // Notify others in room
        socket.to(user.roomId).emit('user-left', {
          userId: user.id,
          userName: user.name,
          socketId: socket.id
        });
        
        // Update user list for room
        const roomUsers = Array.from(rooms.get(user.roomId) || [])
          .map(sid => users.get(sid))
          .filter(Boolean);
        
        console.log(`📊 Room "${user.roomId}" now has ${roomUsers.length} users`);
        
        io.to(user.roomId).emit('users-update', {
          users: roomUsers,
          totalCount: roomUsers.length
        });
        
        // Clean up
        users.delete(socket.id);
        
        // Remove room if empty
        if (rooms.get(user.roomId)?.size === 0) {
          rooms.delete(user.roomId);
          console.log(`🗑️ Removed empty room: ${user.roomId}`);
        }
      }
    });
  });
  
  console.log('🔌 Socket.IO initialized successfully!');
  return io;
}