// frontend/services/webrtcService.ts
import { Socket } from 'socket.io-client';

export class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private socket: Socket;
  private onFileReceived: (file: any) => void;
  
  constructor(socket: Socket, onFileReceived: (file: any) => void) {
    this.socket = socket;
    this.onFileReceived = onFileReceived;
    this.setupSocketListeners();
  }
  
  private setupSocketListeners() {
    // Listen for WebRTC offers
    this.socket.on('webrtc-offer', async (data) => {
      console.log('Received offer from:', data.senderSocketId);
      await this.handleOffer(data);
    });
    
    // Listen for WebRTC answers
    this.socket.on('webrtc-answer', async (data) => {
      console.log('Received answer from:', data.senderSocketId);
      await this.handleAnswer(data);
    });
    
    // Listen for ICE candidates
    this.socket.on('webrtc-ice-candidate', async (data) => {
      await this.handleIceCandidate(data);
    });
  }
  
  // Create peer connection and send file
  async sendFile(targetSocketId: string, file: File) {
    console.log('Sending file to:', targetSocketId);
    
    // Create peer connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.google.com:19302' }]
    });
    
    this.peerConnections.set(targetSocketId, pc);
    
    // Create data channel
    const dataChannel = pc.createDataChannel('fileTransfer');
    this.dataChannels.set(targetSocketId, dataChannel);
    
    // Setup data channel
    dataChannel.onopen = async () => {
      console.log('Data channel opened!');
      // Send file metadata first
      dataChannel.send(JSON.stringify({
        type: 'metadata',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }));
      
      // Send file in chunks
      const chunkSize = 16384; // 16KB chunks
      const reader = new FileReader();
      let offset = 0;
      
      const readSlice = () => {
        const slice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(slice);
      };
      
      reader.onload = (e) => {
        if (e.target?.result) {
          dataChannel.send(e.target.result as ArrayBuffer);
          offset += chunkSize;
          if (offset < file.size) {
            readSlice();
          } else {
            dataChannel.send(JSON.stringify({ type: 'complete' }));
            console.log('File sent successfully!');
          }
        }
      };
      
      readSlice();
    };
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('webrtc-ice-candidate', {
          targetSocketId: targetSocketId,
          candidate: event.candidate
        });
      }
    };
    
    // Create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    // Send offer through socket
    this.socket.emit('webrtc-offer', {
      targetSocketId: targetSocketId,
      offer: offer
    });
  }
  
  private async handleOffer(data: any) {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.google.com:19302' }]
    });
    
    this.peerConnections.set(data.senderSocketId, pc);
    
    // Handle incoming data channel
    pc.ondatachannel = (event) => {
      const channel = event.channel;
      let receivedData: ArrayBuffer[] = [];
      let metadata: any = null;
      
      channel.onmessage = (event) => {
        if (typeof event.data === 'string') {
          const message = JSON.parse(event.data);
          if (message.type === 'metadata') {
            metadata = message;
            receivedData = [];
          } else if (message.type === 'complete') {
            // File received completely
            const blob = new Blob(receivedData);
            const file = new File([blob], metadata.fileName, { type: metadata.fileType });
            this.onFileReceived(file);
          }
        } else {
          // Binary data (file chunk)
          receivedData.push(event.data);
        }
      };
    };
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('webrtc-ice-candidate', {
          targetSocketId: data.senderSocketId,
          candidate: event.candidate
        });
      }
    };
    
    // Set remote description and create answer
    await pc.setRemoteDescription(data.offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    // Send answer
    this.socket.emit('webrtc-answer', {
      targetSocketId: data.senderSocketId,
      answer: answer
    });
  }
  
  private async handleAnswer(data: any) {
    const pc = this.peerConnections.get(data.senderSocketId);
    if (pc) {
      await pc.setRemoteDescription(data.answer);
    }
  }
  
  private async handleIceCandidate(data: any) {
    const pc = this.peerConnections.get(data.senderSocketId);
    if (pc) {
      await pc.addIceCandidate(data.candidate);
    }
  }
}