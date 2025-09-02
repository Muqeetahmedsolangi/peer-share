const { setupWebSocket } = require('./webSocket');

const setupWebRTC = (server: any) => {
  const wss = setupWebSocket(server);

  wss.on('connection', (ws: any) => {
    ws.on('message', (message: any) => {
      const data = JSON.parse(message);
      if (data.type === 'offer' || data.type === 'answer' || data.type === 'candidate') {
        // Broadcast to all clients in the same room
        wss.clients.forEach((client: any) => {
          if (client !== ws && client.readyState === WebSocket.OPEN && client.roomId === ws.roomId) {
            client.send(message);
          }
        });
      }
    });
  });
};

module.exports = { setupWebRTC };