import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export const joinRoom = (roomCode: string, callback: (data: any) => void) => {
  socket.emit('join-room', { roomCode });
  socket.on('room-joined', callback as any);
  socket.on('error', (error: any) => console.error(error));
};

export default socket;