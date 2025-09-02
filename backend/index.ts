import express from 'express';
require('dotenv').config({ path: './config.env' });
const { v4: uuidv4 } = require('uuid');

const { sequelize } = require('./config/database');
const { initUser } = require('./models/user');
const { initRoom } = require('./models/room');

const app = express();
app.use(express.json());

initUser(sequelize);
initRoom(sequelize);

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });

// Add sample user on startup (for testing) - with delay to ensure migrations run first
setTimeout(async () => {
  try {
    const count = await sequelize.models.User.count();
    if (count === 0) {
      await sequelize.models.User.create({
        username: 'testuser',
        email: 'test@example.com',
        authProvider: 'google'
      });
      console.log('Sample user added!');
    }
    
    // Log available models for debugging
    console.log('Available models:', Object.keys(sequelize.models));
  } catch (error) {
    console.log('Sample user creation skipped:', error);
  }
}, 15000); // Wait 15 seconds for migrations to complete


// Create Room API
app.post('/create-room', async (req: express.Request, res: express.Response) => {
  try {
    const user = await sequelize.models.User.findOne(); // For now, use first user
    
    if (!user) {
      return res.status(404).json({ error: 'No users found in database' });
    }
    
    const roomCode = uuidv4().split('-')[0]; // Generate unique code
    const room = await sequelize.models.Room.create({ 
      code: roomCode, 
      createdBy: user.id 
    });
    
    res.json({ 
      success: true,
      code: room.code,
      roomId: room.id 
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get all rooms
app.get('/rooms', async (req: express.Request, res: express.Response) => {
  try {
    const rooms = await sequelize.models.Room.findAll();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Test API endpoint
app.get('/users', async (req: express.Request, res: express.Response) => {
  try {
    const users = await sequelize.models.User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('PeerShare Backend Running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));