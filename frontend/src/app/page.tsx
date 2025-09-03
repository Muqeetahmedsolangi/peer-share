'use client';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { joinRoom } from '@/services/webSocket';

const CREATE_ROOM = gql`
  mutation CreateRoom {
    createRoom { code }
  }
`;

export default function Home() {
  const [createRoom, { data }] = useMutation(CREATE_ROOM);
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const handleJoinRoom = () => {
    joinRoom(joinCode, (data: any) => {
      console.log('Joined room:', data.roomId);
    });
  };

  const handleCreateRoom = async () => {
    const response = await createRoom() as any;
    setRoomCode(response.data?.createRoom?.code || '');
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">PeerShare</h1>
      <button onClick={handleCreateRoom} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Room</button>
      {roomCode && <p>Room Code: {roomCode}</p>}
      {roomCode && <QRCodeSVG value={roomCode} />}
      <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="border p-2" placeholder="Enter Room Code" />
      <button onClick={handleJoinRoom} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Join Room</button>
    </div>
  );
}