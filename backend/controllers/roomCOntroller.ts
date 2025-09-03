const { createRoom, joinRoom } = require('../services/roomService');
const { v4: uuidv4 } = require('uuid');

exports.createRoom = async (req: any, res: any) => {
  try {
    const { name } = req.body;
    const userId = req.userId; // From auth middleware
    const room = await createRoom(name, userId);
    res.status(201).json({ message: 'Room created', room });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinRoom = async (req: any, res: any) => {
  try {
    const { code } = req.body;
    const userId = req.userId; // From auth middleware
    const room = await joinRoom(code, userId);
    res.json({ message: 'Joined room', room });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};