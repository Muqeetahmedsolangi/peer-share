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
  console.log('🔍 getNetworkSubnet input:', ip);
  
  // Handle IPv6 mapped IPv4 (::ffff:192.168.1.5)
  let cleanIP = ip.replace(/^::ffff:/, '');
  
  // Remove brackets from IPv6 format [::1]
  cleanIP = cleanIP.replace(/^\[|\]$/g, '');
  
  // Remove port if present
  if (cleanIP.includes(':')) {
    const parts = cleanIP.split(':');
    cleanIP = parts[0] || cleanIP;
  }
  
  // Split IP into parts
  const parts = cleanIP.split('.');
  
  // Take first 3 octets to identify the network (IPv4)
  // Example: 192.168.1.5 -> 192.168.1 (this is the subnet)
  // All devices on 192.168.1.x will share the same room
  if (parts.length >= 3 && parts.every(part => /^\d+$/.test(part))) {
    const subnet = parts.slice(0, 3).join('.');
    console.log('✅ IPv4 subnet detected:', subnet);
    return subnet;
  }
  
  // For IPv6, use first 64 bits (first 4 groups) or first 3 groups for link-local
  if (cleanIP.includes(':')) {
    const ipv6Parts = cleanIP.split(':');
    // Use first 3 groups for local network detection
    if (ipv6Parts.length >= 3) {
      const subnet = ipv6Parts.slice(0, 3).join(':');
      console.log('✅ IPv6 subnet detected:', subnet);
      return subnet;
    }
  }
  
  // Fallback - use the full IP as subnet (will create separate room)
  console.log('⚠️ Could not extract subnet, using full IP:', cleanIP);
  return cleanIP || 'unknown';
}

export function initializeSocket(server: HttpServer) {
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"]
    },
    // Production settings for reverse proxy (nginx) with SSL
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    // Trust proxy for correct IP detection behind nginx
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket: Socket) => {
    console.log('✅ New user connected:', socket.id);
    
    // Get user's IP address - handle x-forwarded-for (can contain multiple IPs)
    let clientIP = socket.handshake.headers['x-forwarded-for'] as string;
    
    // Log all IP-related headers for debugging
    console.log('🔍 IP Detection Debug:', {
      'x-forwarded-for': socket.handshake.headers['x-forwarded-for'],
      'x-real-ip': socket.handshake.headers['x-real-ip'],
      'cf-connecting-ip': socket.handshake.headers['cf-connecting-ip'],
      'socket.address': socket.handshake.address,
      'socket.remoteAddress': socket.conn.remoteAddress,
      'user-agent': socket.handshake.headers['user-agent']
    });
    
    if (clientIP) {
      // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
      // Take the first one (original client IP)
      clientIP = clientIP.split(',')[0]?.trim() || 'unknown';
    } else {
      // Try other headers that might contain the real IP
      clientIP = (socket.handshake.headers['x-real-ip'] as string) || 
                 (socket.handshake.headers['cf-connecting-ip'] as string) ||
                 socket.handshake.address || 
                 socket.conn.remoteAddress || 
                 'unknown';
    }
    
    // Clean up IPv6 mapped IPv4 addresses (::ffff:192.168.1.1 -> 192.168.1.1)
    if (clientIP.includes('::ffff:')) {
      clientIP = clientIP.replace('::ffff:', '');
    }
    
    // Remove port if present (e.g., "192.168.1.1:52341" -> "192.168.1.1")
    if (clientIP.includes(':')) {
      const ipv6Match = clientIP.match(/^\[(.+)\]:/); // IPv6 format [::1]:port
      if (ipv6Match && ipv6Match[1]) {
        clientIP = ipv6Match[1];
      } else {
        const parts = clientIP.split(':');
        clientIP = parts[0] || clientIP;
      }
    }
    
    console.log('📍 Client IP (cleaned):', clientIP);
    
    // Store the IP on the socket for later use
    (socket as any).clientIP = clientIP;
    
    // Auto-join based on WiFi network (IP subnet)
    socket.on('join-network', async (data: { userName: string; roomName?: string }) => {
      const userName = data.userName || 'Anonymous';

      // Get the stored IP or recalculate if not available
      let detectedIP = (socket as any).clientIP || clientIP;
      
      // Re-detect IP if it wasn't stored properly
      if (!detectedIP || detectedIP === 'unknown') {
        detectedIP = socket.handshake.headers['x-forwarded-for'] as string;
        if (detectedIP) {
          detectedIP = detectedIP.split(',')[0]?.trim();
        } else {
          detectedIP = (socket.handshake.headers['x-real-ip'] as string) || 
                      socket.handshake.address || 
                      socket.conn.remoteAddress || 
                      'unknown';
        }
        // Clean up
        if (detectedIP.includes('::ffff:')) {
          detectedIP = detectedIP.replace('::ffff:', '');
        }
        if (detectedIP.includes(':')) {
          detectedIP = detectedIP.split(':')[0];
        }
      }

      // AUTOMATIC WIFI DETECTION
      // Extract the network subnet from client IP
      const subnet = getNetworkSubnet(detectedIP);

      // Create a room name based on the subnet
      // Example: subnet "192.168.1" -> room "wifi-192.168.1"
      const autoRoomName = `wifi-${subnet}`;

      console.log(`👤 ${userName} joining from IP: ${detectedIP}`);
      console.log(`🌐 Detected subnet: ${subnet}`);
      console.log(`🏠 Auto-assigned room: ${autoRoomName}`);
      console.log(`📱 User-Agent:`, socket.handshake.headers['user-agent']);

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
        clientIP: String(detectedIP),
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
        .filter((u): u is UserInfo => u !== undefined);
      
      console.log(`📊 Room "${autoRoomName}" now has ${roomUsers.length} users:`, 
        roomUsers.map(u => u.name).join(', '));
      
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
  
  // Debug: Log all rooms periodically
  setInterval(() => {
    console.log('\n📊 Current Rooms Status:');
    rooms.forEach((socketIds, roomId) => {
      const roomUsers = Array.from(socketIds)
        .map(sid => users.get(sid))
        .filter((u): u is UserInfo => u !== undefined);
      console.log(`  Room: ${roomId} - ${roomUsers.length} users`);
      roomUsers.forEach(user => {
        console.log(`    - ${user.name} (IP: ${user.clientIP})`);
      });
    });
    console.log('');
  }, 30000); // Every 30 seconds
  
  return io;
}