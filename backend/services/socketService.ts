// backend/services/socketService.ts - AUTOMATIC WIFI NETWORK ISOLATION
import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { saveClip, getClip, deleteClip, checkClipExists } from './redisService';
import { joinRoom as joinRoomService, leaveRoom, getRoomInfo, isUserInRoom } from './roomService';

// Store rooms - AUTOMATICALLY GROUPED BY WIFI NETWORK
const rooms = new Map<string, Set<string>>(); // roomId -> Set of socketIds
const users = new Map<string, UserInfo>(); // socketId -> user info
const roomClips = new Map<string, Set<string>>(); // roomId -> Set of clipIds (track clips per room)

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
      origin: [
        "https://www.dropsos.com",
        "http://www.dropsos.com", 
        "https://api.dropsos.com",
        "http://api.dropsos.com",
        "http://localhost:3000",
        "https://localhost:3000"
      ],
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
    
    // Join a specific room with password
    socket.on('join-room', async (data: { roomId: string; password: string; userName: string }) => {
      const { roomId, password, userName } = data;
      
      if (!roomId || !password || !userName) {
        socket.emit('room-join-response', {
          success: false,
          error: 'Room ID, password, and name are required'
        });
        return;
      }

      console.log(`🚪 ${userName} attempting to join room: ${roomId}`);

      const result = joinRoomService(roomId, password, userName, socket.id);
      
      if (result.success && result.room) {
        // Join the socket.io room
        await socket.join(roomId);
        
        // Store user info
        const userInfo: UserInfo = {
          id: uuidv4(),
          socketId: socket.id,
          roomId: roomId,
          clientIP: (socket as any).clientIP || 'unknown',
          name: userName
        };
        users.set(socket.id, userInfo);
        
        // Send success response
        socket.emit('room-join-response', {
          success: true,
          room: result.room
        });
        
        // Get current room info
        const roomInfo = getRoomInfo(roomId);
        if (roomInfo) {
          const roomUsers = Array.from(roomInfo.memberInfo.values()).map(member => ({
            socketId: member.socketId,
            name: member.name,
            joinedAt: member.joinedAt
          }));
          
          console.log(`📊 Room "${roomId}" now has ${roomUsers.length} users:`, 
            roomUsers.map(u => u.name).join(', '));
          
          // Send updated user list to everyone in this room
          io.to(roomId).emit('room-users-update', {
            users: roomUsers,
            totalCount: roomUsers.length
          });
          
          // Notify others that new user joined
          socket.to(roomId).emit('user-joined-room', {
            userId: userInfo.id,
            userName: userInfo.name,
            socketId: socket.id
          });
        }
      } else {
        socket.emit('room-join-response', {
          success: false,
          error: result.error || 'Failed to join room'
        });
      }
    });
    
    // Auto-join based on WiFi network (IP subnet) - existing functionality
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
      
      // Send existing valid clips from this room to the new user
      const existingClipIds = roomClips.get(autoRoomName) || new Set<string>();
      if (existingClipIds.size > 0) {
        console.log(`📋 Found ${existingClipIds.size} saved clips for room ${autoRoomName}, checking validity...`);
        
        // Check each clip to see if it still exists in Redis (hasn't expired)
        const validClips: Array<{clipId: string; savedBy: string; savedById: string; timestamp: number; preview: string; fileName?: string; fileType?: string; isFile?: boolean}> = [];
        const clipMetadata = (global as any).clipMetadata?.get(autoRoomName);
        
        // Check clips in parallel (without refreshing TTL to validate expiration)
        const clipChecks = Array.from(existingClipIds).map(async (clipId) => {
          try {
            // Check if clip exists in Redis without refreshing TTL
            const exists = await checkClipExists(clipId);
            if (exists) {
              // Clip exists, get full data (this will refresh TTL)
              const result = await getClip(clipId, true);
              if (result.success && result.data) {
                // Get metadata if available
                const metadata = clipMetadata?.get(clipId);
                
                // Decode preview from metadata or from Redis data
                let preview = metadata?.preview || '';
                if (!preview) {
                  try {
                    const decodedText = Buffer.from(result.data.clipText, 'base64').toString('utf8');
                    preview = decodedText.length > 200 
                      ? decodedText.substring(0, 200) + '...' 
                      : decodedText;
                  } catch (e) {
                    preview = '[Binary content]';
                  }
                }
                
                const clipEntry: any = {
                  clipId: clipId,
                  savedBy: metadata?.savedBy || 'Network User',
                  savedById: metadata?.savedById || '',
                  timestamp: metadata?.timestamp || Date.now(),
                  preview: preview
                };
                
                if (result.data.fileName) clipEntry.fileName = result.data.fileName;
                if (result.data.fileType) clipEntry.fileType = result.data.fileType;
                if (result.data.isFile !== undefined) clipEntry.isFile = result.data.isFile;
                
                validClips.push(clipEntry);
              }
            } else {
              // Clip expired in Redis, remove from tracking and delete metadata
              console.log(`⚠️ Clip ${clipId} expired in Redis, removing from room list and metadata`);
              roomClips.get(autoRoomName)?.delete(clipId);
              clipMetadata?.delete(clipId);
            }
          } catch (error) {
            // Clip expired or not found, skip it
            console.log(`⚠️ Clip ${clipId} error checking, removing from room list`);
            roomClips.get(autoRoomName)?.delete(clipId);
            clipMetadata?.delete(clipId);
          }
        });
        
        await Promise.all(clipChecks);
        
        if (validClips.length > 0) {
          console.log(`✅ Sending ${validClips.length} valid clips to new user ${userName}`);
          socket.emit('existing-clips', {
            clips: validClips
          });
        }
      }
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
      
      const messageType = data.isCode ? 'Code' : data.isImage ? 'Image' : 'Text';
      console.log(`💬 ${messageType} message from ${user.name} in room: ${user.roomId}`);
      
      // Broadcast ONLY to users in the same WiFi network
      socket.to(user.roomId).emit('text-message', {
        content: data.content,
        senderName: user.name,
        senderId: socket.id,
        isCode: data.isCode || false,
        isImage: data.isImage || false,
        fileName: data.fileName,
        fileData: data.fileData,
        timestamp: Date.now()
      });
      
      console.log(`✅ Message broadcasted to WiFi network: ${user.roomId}`);
    });
    
     // Handle save clip to Redis
     socket.on('save-clip', async (data: { clipId?: string; clipText: string; fileName?: string; fileType?: string }) => {
      const user = users.get(socket.id);
      if (!user) {
        socket.emit('save-clip-response', {
          success: false,
          error: 'User not found. Please join the network first.'
        });
        return;
      }

      try {
        // Generate clipId if not provided
        const clipId = data.clipId || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const clipText = data.clipText;

        if (!clipText) {
          socket.emit('save-clip-response', {
            success: false,
            error: 'clipText is required'
          });
          return;
        }

        console.log(`💾 User ${user.name} saving clip: ${clipId}${data.fileName ? ` (file: ${data.fileName})` : ''}`);

        const result = await saveClip(clipId, clipText, data.fileName, data.fileType);

        if (result.success) {
          socket.emit('save-clip-response', {
            success: true,
            clipId: clipId,
            message: 'Clip saved successfully',
            expiresIn: 1800 // 30 minutes
          });
          
          // Get preview text
          let previewText = '';
          if (data.fileName) {
            // For files, show file name as preview
            previewText = `📁 ${data.fileName}`;
          } else {
            // For text, decode base64 to get preview (first 200 chars)
            try {
              const decodedText = Buffer.from(clipText, 'base64').toString('utf8');
              previewText = decodedText.length > 200 
                ? decodedText.substring(0, 200) + '...' 
                : decodedText;
            } catch (e) {
              previewText = '[Binary content]';
            }
          }
          
          // Track this clip in the room (store metadata for later retrieval)
          if (!roomClips.has(user.roomId)) {
            roomClips.set(user.roomId, new Set());
          }
          roomClips.get(user.roomId)?.add(clipId);
          
          // Store clip metadata for new users (roomId -> clipId -> metadata)
          if (!(global as any).clipMetadata) {
            (global as any).clipMetadata = new Map();
          }
          if (!(global as any).clipMetadata.has(user.roomId)) {
            (global as any).clipMetadata.set(user.roomId, new Map());
          }
          (global as any).clipMetadata.get(user.roomId).set(clipId, {
            savedBy: user.name,
            savedById: user.id,
            timestamp: Date.now(),
            preview: previewText,
            fileName: data.fileName,
            fileType: data.fileType,
            isFile: !!data.fileName
          });
          
          // Broadcast clip ID and preview to all users in the same WiFi network
          io.to(user.roomId).emit('clip-saved', {
            clipId: clipId,
            savedBy: user.name,
            savedById: user.id,
            timestamp: Date.now(),
            preview: previewText,
            fileName: data.fileName,
            fileType: data.fileType,
            isFile: !!data.fileName
          });
          
          console.log(`✅ Clip ${clipId} saved by ${user.name} and broadcasted to room: ${user.roomId}`);
        } else {
          socket.emit('save-clip-response', {
            success: false,
            error: result.error || 'Failed to save clip'
          });
        }
      } catch (error: any) {
        console.error('Error saving clip:', error);
        socket.emit('save-clip-response', {
          success: false,
          error: error.message || 'Internal server error'
        });
      }
    });

    // Handle get clip from Redis
    socket.on('get-clip', async (data: { clipId: string }) => {
      const user = users.get(socket.id);
      if (!user) {
        socket.emit('get-clip-response', {
          success: false,
          error: 'User not found. Please join the network first.'
        });
        return;
      }

      try {
        const { clipId } = data;

        if (!clipId) {
          socket.emit('get-clip-response', {
            success: false,
            error: 'clipId is required'
          });
          return;
        }

        console.log(`📖 User ${user.name} requesting clip: ${clipId}`);

        const result = await getClip(clipId);

        if (result.success && result.data) {
          socket.emit('get-clip-response', {
            success: true,
            data: result.data,
            expiresIn: 1800 // 30 minutes (TTL refreshed)
          });
          console.log(`✅ Clip ${clipId} retrieved by ${user.name}`);
        } else {
          socket.emit('get-clip-response', {
            success: false,
            error: result.error || 'Clip not found or expired'
          });
        }
      } catch (error: any) {
        console.error('Error getting clip:', error);
        socket.emit('get-clip-response', {
          success: false,
          error: error.message || 'Internal server error'
        });
      }
    });

    // Handle delete clip from Redis
    socket.on('delete-clip', async (data: { clipId: string }) => {
      const user = users.get(socket.id);
      if (!user) {
        socket.emit('delete-clip-response', {
          success: false,
          error: 'User not found. Please join the network first.'
        });
        return;
      }

      try {
        const { clipId } = data;

        if (!clipId) {
          socket.emit('delete-clip-response', {
            success: false,
            error: 'clipId is required'
          });
          return;
        }

        console.log(`🗑️ User ${user.name} deleting clip: ${clipId}`);

        const result = await deleteClip(clipId);

        socket.emit('delete-clip-response', {
          success: result.success,
          message: result.success ? 'Clip deleted successfully' : undefined,
          error: result.error
        });
      } catch (error: any) {
        console.error('Error deleting clip:', error);
        socket.emit('delete-clip-response', {
          success: false,
          error: error.message || 'Internal server error'
        });
      }
    });

    // Room-based chat messaging
    socket.on('room-chat-message', (data: { message: string; roomId: string }) => {
      const user = users.get(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      // Validate user is in the room they're trying to send message to
      const roomInfo = getRoomInfo(data.roomId);
      if (!roomInfo || !isUserInRoom(data.roomId, socket.id)) {
        socket.emit('error', { message: 'You are not in this room' });
        return;
      }

      console.log(`💬 Chat message from ${user.name} in room ${data.roomId}: ${data.message.substring(0, 50)}...`);

      // Broadcast message to all users in the room (including sender for confirmation)
      io.to(data.roomId).emit('room-chat-message', {
        messageId: uuidv4(),
        message: data.message,
        senderName: user.name,
        senderId: user.id,
        senderSocketId: socket.id,
        timestamp: Date.now()
      });
    });

    // Room-based file sharing announcement (P2P via WebRTC)
    socket.on('room-file-offer', (data: { fileName: string; fileSize: number; fileType: string; roomId: string; preview?: string }) => {
      const user = users.get(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      // Validate user is in the room
      const roomInfo = getRoomInfo(data.roomId);
      if (!roomInfo || !isUserInRoom(data.roomId, socket.id)) {
        socket.emit('error', { message: 'You are not in this room' });
        return;
      }

      const isMedia = data.fileType.startsWith('image/') || data.fileType.startsWith('video/');
      console.log(`📁 ${isMedia ? 'Media' : 'File'} offer from ${user.name} in room ${data.roomId}: ${data.fileName} (${data.fileSize} bytes)`);

      // Broadcast file offer to all users in room except sender
      const offerData: any = {
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType,
        senderName: user.name,
        senderSocketId: socket.id,
        timestamp: Date.now()
      };

      // Include preview for images and videos
      if (data.preview && isMedia) {
        offerData.preview = data.preview;
      }

      socket.to(data.roomId).emit('room-file-offered', offerData);
    });

    // Handle WebRTC file transfer signaling
    socket.on('file-transfer-offer', (data: { offer: any; fileName: string; targetSocketId: string }) => {
      console.log(`📥 File transfer offer from ${socket.id} to ${data.targetSocketId} for ${data.fileName}`);
      
      // Forward WebRTC offer to target user for file transfer
      io.to(data.targetSocketId).emit('file-transfer-offer', {
        offer: data.offer,
        fileName: data.fileName,
        senderSocketId: socket.id,
        senderName: users.get(socket.id)?.name || 'Unknown'
      });
    });

    // Handle WebRTC file transfer answer
    socket.on('file-transfer-answer', (data: { answer: any; targetSocketId: string }) => {
      console.log(`📤 File transfer answer from ${socket.id} to ${data.targetSocketId}`);
      
      // Forward WebRTC answer to sender
      io.to(data.targetSocketId).emit('file-transfer-answer', {
        answer: data.answer,
        senderSocketId: socket.id
      });
    });

    // Handle WebRTC ICE candidates for file transfer
    socket.on('file-transfer-ice', (data: { candidate: any; targetSocketId: string }) => {
      console.log(`🧊 File transfer ICE candidate from ${socket.id} to ${data.targetSocketId}`);
      
      // Forward ICE candidate to target
      io.to(data.targetSocketId).emit('file-transfer-ice', {
        candidate: data.candidate,
        senderSocketId: socket.id
      });
    });

    // Handle typing indicators for chat
    socket.on('room-typing', (data: { roomId: string; isTyping: boolean }) => {
      const user = users.get(socket.id);
      if (!user) return;

      // Validate user is in the room
      if (!isUserInRoom(data.roomId, socket.id)) return;

      // Broadcast typing status to others in room
      socket.to(data.roomId).emit('room-user-typing', {
        userName: user.name,
        userId: user.id,
        isTyping: data.isTyping
      });
    });

    // ========== VIDEO/AUDIO CALL HANDLERS ==========
    
    // Call started - notify others in room
    socket.on('call-started', (data: { roomId: string; mode: 'video' | 'audio'; socketId: string }) => {
      const user = users.get(socket.id);
      if (!user) return;

      if (!isUserInRoom(data.roomId, socket.id)) return;

      console.log(`📞 Call started by ${user.name} in room ${data.roomId} (${data.mode} mode)`);
      
      // Notify others in room
      socket.to(data.roomId).emit('call-started', {
        socketId: socket.id,
        mode: data.mode
      });
    });

    // Call offer - forward to target user
    socket.on('call-offer', (data: { targetSocketId: string; offer: any; mode: 'video' | 'audio'; roomId: string }) => {
      const user = users.get(socket.id);
      if (!user) return;

      if (!isUserInRoom(data.roomId, socket.id)) return;

      console.log(`📥 Call offer from ${user.name} to ${data.targetSocketId}`);
      
      // Forward offer to target
      io.to(data.targetSocketId).emit('call-offer', {
        offer: data.offer,
        senderSocketId: socket.id,
        mode: data.mode
      });
    });

    // Call answer - forward to caller
    socket.on('call-answer', (data: { targetSocketId: string; answer: any; roomId: string }) => {
      const user = users.get(socket.id);
      if (!user) return;

      if (!isUserInRoom(data.roomId, socket.id)) return;

      console.log(`📤 Call answer from ${user.name} to ${data.targetSocketId}`);
      
      // Forward answer to caller
      io.to(data.targetSocketId).emit('call-answer', {
        answer: data.answer,
        senderSocketId: socket.id
      });
    });

    // Call ICE candidate - forward to target
    socket.on('call-ice-candidate', (data: { targetSocketId: string; candidate: any; roomId: string }) => {
      const user = users.get(socket.id);
      if (!user) return;

      if (!isUserInRoom(data.roomId, socket.id)) return;

      // Forward ICE candidate to target
      io.to(data.targetSocketId).emit('call-ice-candidate', {
        candidate: data.candidate,
        senderSocketId: socket.id
      });
    });

    // Call ended - notify others
    socket.on('call-ended', (data: { roomId: string; socketId: string }) => {
      const user = users.get(socket.id);
      if (!user) return;

      if (!isUserInRoom(data.roomId, socket.id)) return;

      console.log(`📞 Call ended by ${user.name} in room ${data.roomId}`);
      
      // Notify others in room
      socket.to(data.roomId).emit('call-ended', {
        socketId: socket.id
      });
    });

    // Call mode changed - notify others
    socket.on('call-mode-changed', (data: { roomId: string; mode: 'video' | 'audio'; socketId: string }) => {
      const user = users.get(socket.id);
      if (!user) return;

      if (!isUserInRoom(data.roomId, socket.id)) return;

      // Notify others (optional - for UI updates)
      socket.to(data.roomId).emit('call-mode-changed', {
        socketId: socket.id,
        mode: data.mode
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
      
      const user = users.get(socket.id);
      if (user) {
        // Check if this is a custom room (not WiFi-based)
        const roomInfo = getRoomInfo(user.roomId);
        if (roomInfo) {
          // This is a custom room - use room service
          const result = leaveRoom(user.roomId, socket.id);
          
          // Notify others in room
          socket.to(user.roomId).emit('user-left-room', {
            userId: user.id,
            userName: user.name,
            socketId: socket.id
          });
          
          // Update user list for custom room
          const updatedRoomInfo = getRoomInfo(user.roomId);
          if (updatedRoomInfo) {
            const roomUsers = Array.from(updatedRoomInfo.memberInfo.values()).map(member => ({
              socketId: member.socketId,
              name: member.name,
              joinedAt: member.joinedAt
            }));
            
            io.to(user.roomId).emit('room-users-update', {
              users: roomUsers,
              totalCount: roomUsers.length
            });
          }
        } else {
          // This is a WiFi-based room - use existing logic
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
          
          // Remove WiFi room if empty
          if (rooms.get(user.roomId)?.size === 0) {
            rooms.delete(user.roomId);
            console.log(`🗑️ Removed empty WiFi room: ${user.roomId}`);
          }
        }
        
        // Clean up
        users.delete(socket.id);
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

  // Periodic cleanup: Remove expired clips from metadata (every 5 minutes)
  setInterval(async () => {
    console.log('🧹 Starting periodic cleanup of expired clips...');
    const clipMetadata = (global as any).clipMetadata;
    
    if (!clipMetadata) return;

    let totalRemoved = 0;
    
    for (const [roomId, roomClipMap] of clipMetadata.entries()) {
      const clipIds = Array.from(roomClipMap.keys()) as string[];
      
      for (const clipId of clipIds) {
        try {
          const exists = await checkClipExists(clipId);
          if (!exists) {
            // Clip expired in Redis, remove from metadata and room tracking
            console.log(`🗑️ Removing expired clip ${clipId} from room ${roomId}`);
            roomClipMap.delete(clipId);
            roomClips.get(roomId as string)?.delete(clipId);
            totalRemoved++;
          }
        } catch (error) {
          console.error(`Error checking clip ${clipId}:`, error);
        }
      }
    }

    if (totalRemoved > 0) {
      console.log(`✅ Cleanup complete: Removed ${totalRemoved} expired clip(s) from metadata`);
    }
  }, 5 * 60 * 1000); // Every 5 minutes
  
  return io;
}