const WebSocket = require('ws');
const { sequelize } = require('../config/database');

const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: any) => {
    console.log('New client connected');

    ws.on('message', async (message: any) => {
      const data = JSON.parse(message);
      if (data.type === 'join-room' && data.roomCode) {
        const room = await sequelize.models.Room.findOne({ where: { code: data.roomCode } });
        if (room) {
          ws.roomId = room.id;
          ws.send(JSON.stringify({ type: 'room-joined', roomId: room.id }));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
        }
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
};

module.exports = { setupWebSocket };