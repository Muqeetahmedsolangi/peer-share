const { Server } = require('socket.io');
const { sequelize } = require('../config/database');

const setupWebSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket: any) => {
    console.log('New client connected:', socket.id);

    socket.on('join-room', async (data: any) => {
      try {
        const { roomCode } = data;
        const room = await sequelize.models.Room.findOne({ where: { code: roomCode } });
        
        if (room) {
          socket.join(roomCode);
          socket.roomId = room.id;
          socket.emit('room-joined', { roomId: room.id, roomCode });
          console.log(`Client ${socket.id} joined room ${roomCode}`);
        } else {
          socket.emit('error', { message: 'Room not found' });
        }
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = { setupWebSocket };