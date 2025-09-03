const { setupWebSocket } = require('./webSocket');

const setupWebRTC = (server: any) => {
  const io = setupWebSocket(server);

  io.on('connection', (socket: any) => {
    socket.on('offer', (data: any) => {
      // Broadcast offer to other clients in the same room
      socket.to(socket.roomId).emit('offer', data);
    });

    socket.on('answer', (data: any) => {
      // Broadcast answer to other clients in the same room
      socket.to(socket.roomId).emit('answer', data);
    });

    socket.on('candidate', (data: any) => {
      // Broadcast ICE candidate to other clients in the same room
      socket.to(socket.roomId).emit('candidate', data);
    });
  });
};

module.exports = { setupWebRTC };