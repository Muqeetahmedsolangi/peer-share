const { createRoom, joinRoom, validateRoomCredentials } = require('../services/roomService');

// Create a new room
exports.createRoom = async (req: any, res: any) => {
  try {
    const { roomName, password, creatorName } = req.body;

    if (!roomName || !password || !creatorName) {
      return res.status(400).json({
        success: false,
        error: 'Room name, password, and creator name are required'
      });
    }

    const result = createRoom(roomName, password, creatorName);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        roomId: result.roomId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};

// Validate room credentials (before joining)
exports.validateRoom = async (req: any, res: any) => {
  try {
    const { roomId, password } = req.body;

    if (!roomId || !password) {
      return res.status(400).json({
        success: false,
        error: 'Room ID and password are required'
      });
    }

    const result = validateRoomCredentials(roomId, password);

    if (result.success) {
      res.json({
        success: true,
        roomName: result.roomName
      });
    } else {
      res.status(401).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};

// Join an existing room
exports.joinRoom = async (req: any, res: any) => {
  try {
    const { roomId, password, userName } = req.body;

    if (!roomId || !password || !userName) {
      return res.status(400).json({
        success: false,
        error: 'Room ID, password, and user name are required'
      });
    }

    // For HTTP endpoint, we don't have socket ID yet
    // This will be handled via socket events instead
    res.json({
      success: true,
      message: 'Ready to join room via socket connection'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};