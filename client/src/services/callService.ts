// WebRTC Calling Service for Audio/Video Calls
import { Socket } from 'socket.io-client';

export interface CallParticipant {
  odId: string;
visitorId: string;
  displayName: string;
  odSocket: string;
  stream?: MediaStream;
  isSpeaking: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

export interface CallState {
  isInCall: boolean;
  isCallCreator: boolean;
  callType: 'audio' | 'video';
  participants: Map<string, CallParticipant>;
  localStream: MediaStream | null;
  isRinging: boolean;
  incomingCall: IncomingCallData | null;
  activeCallInRoom: ActiveCallInfo | null;
}

export interface IncomingCallData {
  callCode: string;
  odRoom: string;
  callerName: string;
  callerSocket: string;
  callType: 'audio' | 'video';
  callerVisitorId: string;
}

export interface ActiveCallInfo {
  callCode: string;
  participantCount: number;
  callType: 'audio' | 'video';
  creatorSocket: string;
  creatorName: string;
}

class CallService {
  private socket: Socket | null = null;
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private remoteStreams: Map<string, MediaStream> = new Map();
  private audioContexts: Map<string, { context: AudioContext; analyser: AnalyserNode }> = new Map();
  private onUpdate: ((participants: Map<string, CallParticipant>) => void) | null = null;
  private onStateChange: ((state: Partial<CallState>) => void) | null = null;
  private currentCallCode: string | null = null;
  private callType: 'audio' | 'video' = 'audio';
  private members: Map<string, CallParticipant> = new Map();
  private isCreator: boolean = false;
  private creatorSocket: string | null = null;

  private iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ];

  initialize(socket: Socket, callbacks: {
    onUpdate: (participants: Map<string, CallParticipant>) => void;
    onStateChange: (state: Partial<CallState>) => void;
  }) {
    this.socket = socket;
    this.onUpdate = callbacks.onUpdate;
    this.onStateChange = callbacks.onStateChange;
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    // Incoming call notification
    this.socket.on('call-incoming', (data: any) => {
      // Don't show incoming call if already in a call
      if (this.currentCallCode) return;

      this.onStateChange?.({
        isRinging: true,
        incomingCall: {
          callCode: data.callCode,
          odRoom: data.odRoom,
          callerName: data.callerName,
          callerSocket: data.callerSocket,
          callType: data.callType,
          callerVisitorId: data.callerVisitorId
        }
      });
    });

    // Someone accepted our call (only creator receives this)
    this.socket.on('call-accepted', async (data: any) => {
      // Only connect if we don't already have a connection to this peer
      if (!this.peerConnections.has(data.peerSocket)) {
        await this.connectToPeer(data.peerSocket, data.peerName, data.peerVisitorId);
      }
    });

    // Someone rejected our call
    this.socket.on('call-rejected', (data: any) => {
      console.log(`${data.userName} rejected the call`);
    });

    // Call ended by creator - everyone must leave
    this.socket.on('call-ended-by-creator', () => {
      console.log('Call ended by creator');
      this.cleanupCall();
      this.onStateChange?.({
        isInCall: false,
        isCallCreator: false,
        localStream: null,
        isRinging: false,
        incomingCall: null,
        activeCallInRoom: null
      });
      this.notifyUpdate();
    });

    // A participant left the call (not the creator)
    this.socket.on('call-participant-left', (data: any) => {
      console.log(`${data.userName} left the call`);
      this.removePeer(data.socketId)}
    );

    // Active call info for late joiners
    this.socket.on('call-active-in-room', (data: ActiveCallInfo) => {
      if (!this.currentCallCode) {
        this.onStateChange?.({
          activeCallInRoom: data
        });
      }
    });

    // No active call in room
    this.socket.on('call-no-active', () => {
      this.onStateChange?.({
        activeCallInRoom: null
      });
    });

    // New participant joining existing call - connect to them
    this.socket.on('call-new-participant', async (data: any) => {
      if (this.currentCallCode === data.callCode) {
        // Only connect if we don't already have a connection to this peer
        if (!this.peerConnections.has(data.socketId)) {
          await this.connectToPeer(data.socketId, data.userName, data.visitorId);
        }
      }
    });

    // Receive list of existing participants when joining ongoing call
    this.socket.on('call-existing-participants', async (data: any) => {
      if (this.currentCallCode === data.callCode && data.participants) {
        console.log(`Received ${data.participants.length} existing participants`);
        // Connect to all existing participants (only if not already connected)
        for (const participant of data.participants) {
          if (!this.peerConnections.has(participant.socketId)) {
            await this.connectToPeer(participant.socketId, participant.userName, participant.visitorId);
          }
        }
      }
    });

    // WebRTC signaling
    this.socket.on('call-offer', async (data: any) => await this.handleOffer(data));
    this.socket.on('call-answer', async (data: any) => await this.handleAnswer(data));
    this.socket.on('call-ice-candidate', async (data: any) => await this.handleIceCandidate(data));

    // Video upgrade notification
    this.socket.on('call-video-upgraded', (data: any) => {
      const member = this.members.get(data.socketId);
      if (member) {
        member.isVideoEnabled = true;
        this.notifyUpdate();
      }
    });
  }

  async startCall(roomCode: string, callType: 'audio' | 'video', callerName: string, visitorId: string): Promise<boolean> {
    try {
      this.callType = callType;
      this.currentCallCode = 'call-' + Date.now();
      this.isCreator = true;
      this.creatorSocket = this.socket?.id || null;

      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: callType === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false
      });

      this.setupVAD('local', this.localStream);

      this.members.set('local', {
        odId: 'local',
        visitorId: visitorId,
        displayName: callerName,
        odSocket: this.socket?.id || '',
        stream: this.localStream,
        isSpeaking: false,
        isVideoEnabled: callType === 'video',
        isAudioEnabled: true
      });

      this.socket?.emit('call-start', {
        callCode: this.currentCallCode,
        roomCode,
        callType,
        callerName,
        visitorId
      });

      this.onStateChange?.({
        isInCall: true,
        isCallCreator: true,
        callType,
        localStream: this.localStream,
        activeCallInRoom: null
      });
      this.notifyUpdate();
      return true;
    } catch (error) {
      console.error('Failed to start call:', error);
      return false;
    }
  }

  async acceptCall(incoming: IncomingCallData, userName: string, visitorId: string): Promise<boolean> {
    try {
      this.callType = incoming.callType;
      this.currentCallCode = incoming.callCode;
      this.isCreator = false;
      this.creatorSocket = incoming.callerSocket;

      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: incoming.callType === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false
      });

      this.setupVAD('local', this.localStream);

      this.members.set('local', {
        odId: 'local',
        visitorId: visitorId,
        displayName: userName,
        odSocket: this.socket?.id || '',
        stream: this.localStream,
        isSpeaking: false,
        isVideoEnabled: incoming.callType === 'video',
        isAudioEnabled: true
      });

      this.socket?.emit('call-accept', {
        callCode: incoming.callCode,
        odRoom: incoming.odRoom,
        peerName: userName,
        peerVisitorId: visitorId,
        callerSocket: incoming.callerSocket
      });

      this.onStateChange?.({
        isInCall: true,
        isCallCreator: false,
        callType: incoming.callType,
        localStream: this.localStream,
        isRinging: false,
        incomingCall: null,
        activeCallInRoom: null
      });

      this.notifyUpdate();
      return true;
    } catch (error) {
      console.error('Failed to accept call:', error);
      return false;
    }
  }

  async joinOngoingCall(activeCall: ActiveCallInfo, userName: string, visitorId: string, roomCode: string): Promise<boolean> {
    try {
      this.callType = activeCall.callType;
      this.currentCallCode = activeCall.callCode;
      this.isCreator = false;
      this.creatorSocket = activeCall.creatorSocket;

      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: activeCall.callType === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false
      });

      this.setupVAD('local', this.localStream);

      this.members.set('local', {
        odId: 'local',
        visitorId: visitorId,
        displayName: userName,
        odSocket: this.socket?.id || '',
        stream: this.localStream,
        isSpeaking: false,
        isVideoEnabled: activeCall.callType === 'video',
        isAudioEnabled: true
      });

      this.socket?.emit('call-join-ongoing', {
        callCode: activeCall.callCode,
        roomCode,
        userName,
        visitorId
      });

      this.onStateChange?.({
        isInCall: true,
        isCallCreator: false,
        callType: activeCall.callType,
        localStream: this.localStream,
        isRinging: false,
        incomingCall: null,
        activeCallInRoom: null
      });

      this.notifyUpdate();
      return true;
    } catch (error) {
      console.error('Failed to join ongoing call:', error);
      return false;
    }
  }

  rejectCall(incoming: IncomingCallData, userName: string) {
    this.socket?.emit('call-reject', {
      callCode: incoming.callCode,
      odRoom: incoming.odRoom,
      userName,
      callerSocket: incoming.callerSocket
    });
    this.onStateChange?.({ isRinging: false, incomingCall: null });
  }

  async leaveCall() {
    // If creator leaves, end call for everyone
    if (this.isCreator) {
      this.socket?.emit('call-end-by-creator', { callCode: this.currentCallCode });
    } else {
      // Participant leaving - just notify others
      this.socket?.emit('call-leave', { callCode: this.currentCallCode });
    }

    this.cleanupCall();

    this.onStateChange?.({
      isInCall: false,
      isCallCreator: false,
      localStream: null,
      isRinging: false,
      incomingCall: null
    });
    this.notifyUpdate();
  }

  private cleanupCall() {
    // Close all peer connections
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();

    // Stop all local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        this.localStream?.removeTrack(track);
      });
      this.localStream = null;
    }

    // Stop all remote stream tracks
    this.remoteStreams.forEach((stream) => {
      stream.getTracks().forEach(track => track.stop());
    });
    this.remoteStreams.clear();

    // Close all audio contexts
    this.audioContexts.forEach(({ context }) => {
      try {
        context.close();
      } catch (e) {
        // Ignore errors when closing audio context
      }
    });
    this.audioContexts.clear();

    // Clear members
    this.members.clear();
    this.currentCallCode = null;
    this.isCreator = false;
    this.creatorSocket = null;
  }

  private removePeer(socketId: string) {
    const pc = this.peerConnections.get(socketId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(socketId);
    }
    this.remoteStreams.delete(socketId);
    const audioCtx = this.audioContexts.get(socketId);
    if (audioCtx) {
      audioCtx.context.close();
      this.audioContexts.delete(socketId);
    }
    this.members.delete(socketId);
    this.notifyUpdate();
  }

  private async connectToPeer(peerSocket: string, peerName: string, peerVisitorId: string) {
    const mySocketId = this.socket?.id || '';

    // Only the socket with the "lower" ID creates the offer to avoid both sides offering simultaneously
    const shouldCreateOffer = mySocketId < peerSocket;

    // If we shouldn't create offer, the other side will - just add member info and wait
    if (!shouldCreateOffer) {
      // Add member placeholder so we know about them
      if (!this.members.has(peerSocket)) {
        this.members.set(peerSocket, {
          odId: peerSocket,
          visitorId: peerVisitorId,
          displayName: peerName,
          odSocket: peerSocket,
          stream: undefined,
          isSpeaking: false,
          isVideoEnabled: false,
          isAudioEnabled: false
        });
        this.notifyUpdate();
      }
      return;
    }

    const pc = new RTCPeerConnection({ iceServers: this.iceServers });
    this.peerConnections.set(peerSocket, pc);

    // Add all local tracks
    this.localStream?.getTracks().forEach(track => {
      pc.addTrack(track, this.localStream!);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit('call-ice-candidate', {
          candidate: event.candidate,
          targetSocket: peerSocket
        });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      this.remoteStreams.set(peerSocket, remoteStream);
      this.setupVAD(peerSocket, remoteStream);

      const existingMember = this.members.get(peerSocket);
      this.members.set(peerSocket, {
        odId: peerSocket,
        visitorId: peerVisitorId,
        displayName: peerName,
        odSocket: peerSocket,
        stream: remoteStream,
        isSpeaking: existingMember?.isSpeaking || false,
        isVideoEnabled: remoteStream.getVideoTracks().length > 0 && remoteStream.getVideoTracks()[0].enabled,
        isAudioEnabled: remoteStream.getAudioTracks().length > 0 && remoteStream.getAudioTracks()[0].enabled
      });
      this.notifyUpdate();
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.removePeer(peerSocket);
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.socket?.emit('call-offer', { offer, targetSocket: peerSocket });
  }

  private async handleOffer(data: any) {
    const pc = new RTCPeerConnection({ iceServers: this.iceServers });
    this.peerConnections.set(data.fromSocket, pc);

    // Add all local tracks
    this.localStream?.getTracks().forEach(track => {
      pc.addTrack(track, this.localStream!);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit('call-ice-candidate', {
          candidate: event.candidate,
          targetSocket: data.fromSocket
        });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      this.remoteStreams.set(data.fromSocket, remoteStream);
      this.setupVAD(data.fromSocket, remoteStream);

      const existingMember = this.members.get(data.fromSocket);
      this.members.set(data.fromSocket, {
        odId: data.fromSocket,
        visitorId: data.fromVisitorId,
        displayName: data.fromName,
        odSocket: data.fromSocket,
        stream: remoteStream,
        isSpeaking: existingMember?.isSpeaking || false,
        isVideoEnabled: remoteStream.getVideoTracks().length > 0 && remoteStream.getVideoTracks()[0].enabled,
        isAudioEnabled: remoteStream.getAudioTracks().length > 0 && remoteStream.getAudioTracks()[0].enabled
      });
      this.notifyUpdate();
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.removePeer(data.fromSocket);
      }
    };

    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    this.socket?.emit('call-answer', { answer, targetSocket: data.fromSocket });
  }

  private async handleAnswer(data: any) {
    const pc = this.peerConnections.get(data.fromSocket);
    if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
  }

  private async handleIceCandidate(data: any) {
    const pc = this.peerConnections.get(data.fromSocket);
    if (pc && data.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (e) {
        console.error('ICE error:', e);
      }
    }
  }

  private setupVAD(key: string, stream: MediaStream) {
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      source.connect(analyser);
      this.audioContexts.set(key, { context: ctx, analyser });

      const data = new Uint8Array(analyser.frequencyBinCount);
      const check = () => {
        if (!this.audioContexts.has(key)) return;
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        const speaking = avg > 30;
        const member = this.members.get(key);
        if (member && member.isSpeaking !== speaking) {
          member.isSpeaking = speaking;
          this.notifyUpdate();
        }
        requestAnimationFrame(check);
      };
      check();
    } catch (e) {
      console.error('VAD error:', e);
    }
  }

  toggleAudio(): boolean {
    const track = this.localStream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      const local = this.members.get('local');
      if (local) {
        local.isAudioEnabled = track.enabled;
        this.notifyUpdate();
      }
      return track.enabled;
    }
    return false;
  }

  async toggleVideo(): Promise<boolean> {
    const existingTrack = this.localStream?.getVideoTracks()[0];

    if (existingTrack) {
      if (existingTrack.enabled) {
        // Turning video OFF - just disable the track
        existingTrack.enabled = false;
        const local = this.members.get('local');
        if (local) {
          local.isVideoEnabled = false;
          this.notifyUpdate();
        }
        return false;
      } else {
        // Turning video ON - need to get a new video track to avoid black screen issues
        try {
          const newVideoStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
          });
          const newVideoTrack = newVideoStream.getVideoTracks()[0];

          // Stop the old track
          existingTrack.stop();

          // Remove old track and add new one to local stream
          this.localStream?.removeTrack(existingTrack);
          this.localStream?.addTrack(newVideoTrack);

          // Replace track in all peer connections
          for (const [, pc] of this.peerConnections) {
            const senders = pc.getSenders();
            const videoSender = senders.find(s => s.track?.kind === 'video' || (!s.track && s.track !== undefined));
            if (videoSender) {
              await videoSender.replaceTrack(newVideoTrack);
            } else {
              // No video sender found, add the track
              pc.addTrack(newVideoTrack, this.localStream!);
            }
          }

          const local = this.members.get('local');
          if (local) {
            local.isVideoEnabled = true;
            local.stream = this.localStream || undefined;
            this.notifyUpdate();
          }

          this.onStateChange?.({ localStream: this.localStream });
          return true;
        } catch (error) {
          console.error('Failed to re-enable video:', error);
          // Fallback: just enable the existing track
          existingTrack.enabled = true;
          const local = this.members.get('local');
          if (local) {
            local.isVideoEnabled = true;
            this.notifyUpdate();
          }
          return true;
        }
      }
    }
    return false;
  }

  async upgradeToVideo(): Promise<boolean> {
    if (this.callType === 'video' && this.localStream?.getVideoTracks().length) {
      return true;
    }

    try {
      // Get video stream
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });

      const videoTrack = videoStream.getVideoTracks()[0];

      // Add to local stream
      if (this.localStream) {
        // Remove any existing video tracks first
        this.localStream.getVideoTracks().forEach(track => {
          this.localStream?.removeTrack(track);
          track.stop();
        });
        this.localStream.addTrack(videoTrack);
      }

      // Add video track to all peer connections using proper renegotiation
      for (const [socketId, pc] of this.peerConnections) {
        // Find existing sender or add new track
        const senders = pc.getSenders();
        const videoSender = senders.find(s => s.track?.kind === 'video');

        if (videoSender) {
          await videoSender.replaceTrack(videoTrack);
        } else {
          pc.addTrack(videoTrack, this.localStream!);
          // Renegotiate
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          this.socket?.emit('call-offer', { offer, targetSocket: socketId });
        }
      }

      this.callType = 'video';
      const local = this.members.get('local');
      if (local) {
        local.isVideoEnabled = true;
        local.stream = this.localStream || undefined;
        this.notifyUpdate();
      }

      // Notify others about video upgrade
      this.socket?.emit('call-video-upgrade', { callCode: this.currentCallCode });
      this.onStateChange?.({ callType: 'video', localStream: this.localStream });

      return true;
    } catch (error) {
      console.error('Failed to upgrade to video:', error);
      return false;
    }
  }

  private notifyUpdate() {
    this.onUpdate?.(new Map(this.members));
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getMembers(): Map<string, CallParticipant> {
    return new Map(this.members);
  }

  isActive(): boolean {
    return this.currentCallCode !== null;
  }

  isCallCreatorUser(): boolean {
    return this.isCreator;
  }

  cleanup() {
    if (this.currentCallCode) {
      this.leaveCall();
    }
    this.socket = null;
    this.onUpdate = null;
    this.onStateChange = null;
  }
}

export const callService = new CallService();
export default callService;
