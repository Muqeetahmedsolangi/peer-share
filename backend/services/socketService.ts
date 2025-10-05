// backend/services/socketService.ts - AUTOMATIC WIFI NETWORK ISOLATION
import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

// Store rooms - AUTOMATICALLY GROUPED BY WIFI NETWORK
const rooms = new Map<string, Set<string>>(); // roomId -> Set of socketIds
const users = new Map<string, UserInfo>(); // socketId -> user info

interface UserInfo {
  id: string;
  socketId: string;
  roomId: string;
  clientIP: string;
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

// Extract network subnet from IP address
function getNetworkSubnet(ip: string): string {
  // Remove IPv6 prefix if present (::ffff:192.168.1.5 -> 192.168.1.5)
  const cleanIP = ip.replace('::ffff:', '');
  
  // Split IP into parts
  const parts = cleanIP.split('.');
  
  // Take first 3 octets to identify the network
  // Example: 192.168.1.5 -> 192.168.1 (this is the subnet)
  // All devices on 192.168.1.x will share the same room
  if (parts.length >= 3) {
    return parts.slice(0, 3).join('.');
  }
  
  // Fallback for IPv6 or unusual formats
  return cleanIP;
}

export function initializeSocket(server: HttpServer) {
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('✅ New user connected:', socket.id);
    
    // Get user's IP address
    const clientIP = (socket.handshake.headers['x-forwarded-for'] as string) || 
                     socket.handshake.address || 
                     'unknown';
    
    console.log('📍 Client IP:', clientIP);
    
    // Auto-join based on WiFi network (IP subnet)
    socket.on('join-network', async (data: { userName: string; roomName?: string }) => {
      const userName = data.userName || 'Anonymous';

      // AUTOMATIC WIFI DETECTION
      // Extract the network subnet from client IP
      const subnet = getNetworkSubnet(clientIP);

      // Create a room name based on the subnet
      // Example: subnet "192.168.1" -> room "wifi-192.168.1"
      const autoRoomName = `wifi-${subnet}`;

      console.log(`👤 ${userName} joining from IP: ${clientIP}`);
      console.log(`🌐 Detected subnet: ${subnet}`);
      console.log(`🏠 Auto-assigned room: ${autoRoomName}`);

      // Create room if it doesn't exist
      if (!rooms.has(autoRoomName)) {
        rooms.set(autoRoomName, new Set());
        console.log(`✨ Created new room for network: ${autoRoomName}`);
      }

      // Add user to room - AWAIT to ensure join completes before emitting events
      await socket.join(autoRoomName);
      rooms.get(autoRoomName)?.add(socket.id);
      
      // Store user info
      const userInfo: UserInfo = {
        id: uuidv4(),
        socketId: socket.id,
        roomId: autoRoomName,
        clientIP: String(clientIP),
        name: userName
      };
      users.set(socket.id, userInfo);
      
      // Send room info back to user
      socket.emit('joined-room', {
        roomId: autoRoomName,
        userId: userInfo.id,
        userName: userInfo.name,
        networkSubnet: subnet
      });
      
      // Get all users in same WiFi network
      const roomUsers = Array.from(rooms.get(autoRoomName) || [])
        .map(sid => users.get(sid))
        .filter(Boolean);
      
      console.log(`📊 Room "${autoRoomName}" now has ${roomUsers.length} users:`, 
        roomUsers.map(u => u?.name).join(', '));
      
      // Send updated user list to everyone in this WiFi network only
      io.to(autoRoomName).emit('users-update', {
        users: roomUsers,
        totalCount: roomUsers.length
      });
      
      // Notify others in same WiFi that new user joined
      socket.to(autoRoomName).emit('user-joined', {
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
      
      // Only notify users in the same WiFi network
      socket.to(user.roomId).emit('file-available', fileShare);
      console.log(`📁 File shared: ${data.fileName} in room: ${user.roomId}`);
    });
    
    // Handle text/code message sharing
    socket.on('text-message', (data: any) => {
      const user = users.get(socket.id);
      if (!user) {
        console.log('⚠️ User not found for socket:', socket.id);
        return;
      }
      
      const messageType = data.isCode ? 'Code' : 'Text';
      console.log(`💬 ${messageType} message from ${user.name} in room: ${user.roomId}`);
      
      // Broadcast ONLY to users in the same WiFi network
      socket.to(user.roomId).emit('text-message', {
        content: data.content,
        senderName: user.name,
        senderId: socket.id,
        isCode: data.isCode || false,
        timestamp: Date.now()
      });
      
      console.log(`✅ Message broadcasted to WiFi network: ${user.roomId}`);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
      
      const user = users.get(socket.id);
      if (user) {
        // Remove from room
        rooms.get(user.roomId)?.delete(socket.id);
        
        // Notify others in same WiFi network
        socket.to(user.roomId).emit('user-left', {
          userId: user.id,
          userName: user.name,
          socketId: socket.id
        });
        
        // Update user list for WiFi network
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
  console.log('🌐 Network isolation: ENABLED');
  console.log('📡 Users will be automatically grouped by WiFi subnet');
  return io;
}