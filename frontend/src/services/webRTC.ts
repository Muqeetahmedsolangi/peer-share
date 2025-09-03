import socket from './webSocket';

export const setupP2P = (roomId: string) => {
  const pc = new RTCPeerConnection();

  socket.on('offer', (offer : any) => {
    pc.setRemoteDescription(new RTCSessionDescription(offer));
    pc.createAnswer().then((answer : any) => {
      pc.setLocalDescription(answer);
      socket.emit('answer', { roomId, answer });
    });
  });

  // Add ICE candidate and file sharing logic here
};