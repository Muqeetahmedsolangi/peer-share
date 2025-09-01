import express from 'express';
require('dotenv').config({ path: './config.env' });

const { sequelize } = require('./config/database');
const { initUser } = require('./models/user');

const app = express();
app.use(express.json());

initUser(sequelize);

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
  } catch (error) {
    console.log('Sample user creation skipped:', error);
  }
}, 15000); // Wait 15 seconds for migrations to complete

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