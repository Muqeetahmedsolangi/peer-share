const { Room, RoomMember } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.createRoom = async (name: any, userId: any) => {
  const roomCode = uuidv4().split('-')[0];
  const room = await Room.create({ name, code: roomCode, createdBy: userId });
  await RoomMember.create({ roomId: room.id, userId: [userId] }); // Initial user as creator
  return room;
};

exports.joinRoom = async (code: any, userId: any) => {
  const room = await Room.findOne({ where: { code } });
  if (!room) throw new Error('Room not found');
  const roomMember = await RoomMember.findOne({ where: { roomId: room.id } });
  if (roomMember) {
    roomMember.userId = [...new Set([...roomMember.userId, userId])]; // Add user to JSON array
    await roomMember.save();
  } else {
    await RoomMember.create({ roomId: room.id, userId: [userId] });
  }
  return room;
};