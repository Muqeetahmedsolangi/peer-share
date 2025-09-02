"use client";

import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const CREATE_ROOM = gql`
  mutation CreateRoom {
    createRoom {
      success
      code
      roomId
    }
  }
`;

export default function Home() {
  const [createRoom, { data, loading }] = useMutation(CREATE_ROOM);
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = async () => {
    try {
      const response = await createRoom();
      if (response.data.createRoom.success) {
        setRoomCode(response.data.createRoom.code);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
        PeerShare
      </h1>
      
      <button 
        onClick={handleCreateRoom} 
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Room'}
      </button>
      
      {roomCode && (
        <div className="mt-4">
          <p className="text-lg font-semibold mb-2">Room Code: {roomCode}</p>
          <div className="flex justify-center">
            <QRCodeCanvas value={roomCode} size={200} />
          </div>
        </div>
      )}
    </div>
  );
}