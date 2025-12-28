// backend/services/roomService.ts
import { v4 as uuidv4 } from 'uuid';

// In-memory room storage (for simplicity)
// In production, you'd use a database
interface Room {
  id: string;
  name: string;
  password: string;
  createdBy: string;
  createdAt: Date;
  members: Set<string>; // socket IDs
  memberInfo: Map<string, { socketId: string; name: string; joinedAt: Date }>; // socket ID -> user info
}

const rooms = new Map<string, Room>();

// Generate a simple 6-digit room code
function generateRoomCode(): string {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Create a new room
export function createRoom(roomName: string, password: string, creatorName: string): { success: boolean; roomId?: string; error?: string } {
  try {
    if (!roomName.trim() || !password.trim()) {
      return { success: false, error: 'Room name and password are required' };
    }

    const roomId = generateRoomCode();
    
    // Check if room ID already exists (very unlikely but safe)
    while (rooms.has(roomId)) {
      const newRoomId = generateRoomCode();
      if (!rooms.has(newRoomId)) {
        break;
      }
    }

    const room: Room = {
      id: roomId,
      name: roomName.trim(),
      password: password.trim(),
      createdBy: creatorName.trim(),
      createdAt: new Date(),
      members: new Set(),
      memberInfo: new Map()
    };

    rooms.set(roomId, room);
    
    console.log(`✨ Room created: ${roomId} - "${roomName}" by ${creatorName}`);
    
    return { success: true, roomId };
  } catch (error: any) {
    console.error('Error creating room:', error);
    return { success: false, error: 'Failed to create room' };
  }
}

// Join an existing room
export function joinRoom(roomId: string, password: string, userName: string, socketId: string): { success: boolean; room?: any; error?: string } {
  try {
    if (!roomId.trim() || !password.trim() || !userName.trim()) {
      return { success: false, error: 'Room ID, password, and name are required' };
    }

    const room = rooms.get(roomId.toUpperCase());
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.password !== password.trim()) {
      return { success: false, error: 'Incorrect password' };
    }

    // Add user to room
    room.members.add(socketId);
    room.memberInfo.set(socketId, {
      socketId,
      name: userName.trim(),
      joinedAt: new Date()
    });

    console.log(`👥 ${userName} joined room ${roomId} (${room.members.size} members)`);

    // Return room info (without password for security)
    const roomInfo = {
      id: room.id,
      name: room.name,
      createdBy: room.createdBy,
      createdAt: room.createdAt,
      memberCount: room.members.size,
      members: Array.from(room.memberInfo.values()).map(member => ({
        name: member.name,
        joinedAt: member.joinedAt
      }))
    };

    return { success: true, room: roomInfo };
  } catch (error: any) {
    console.error('Error joining room:', error);
    return { success: false, error: 'Failed to join room' };
  }
}

// Leave a room
export function leaveRoom(roomId: string, socketId: string): { success: boolean; memberCount?: number } {
  try {
    const room = rooms.get(roomId);
    
    if (!room) {
      return { success: false };
    }

    const memberInfo = room.memberInfo.get(socketId);
    if (memberInfo) {
      console.log(`👋 ${memberInfo.name} left room ${roomId}`);
    }

    room.members.delete(socketId);
    room.memberInfo.delete(socketId);

    // Delete room if empty
    if (room.members.size === 0) {
      rooms.delete(roomId);
      console.log(`🗑️ Deleted empty room: ${roomId}`);
      return { success: true, memberCount: 0 };
    }

    return { success: true, memberCount: room.members.size };
  } catch (error: any) {
    console.error('Error leaving room:', error);
    return { success: false };
  }
}

// Get room info
export function getRoomInfo(roomId: string): Room | null {
  return rooms.get(roomId) || null;
}

// Get all rooms (for debugging)
export function getAllRooms(): Map<string, Room> {
  return rooms;
}

// Check if user is in room
export function isUserInRoom(roomId: string, socketId: string): boolean {
  const room = rooms.get(roomId);
  return room ? room.members.has(socketId) : false;
}