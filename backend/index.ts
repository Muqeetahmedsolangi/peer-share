// backend/index.ts
// Load environment variables - prioritize .env.local for local development
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback to .env if .env.local doesn't exist

const express = require('express');
const http = require('http');
const cors = require('cors');
const { initializeSocket } = require('./services/socketService');

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT) || 4000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'];

// Trust proxy for correct IP detection behind nginx/reverse proxy
app.set('trust proxy', true);

// Initialize Socket.IO
initializeSocket(server);

// Middleware
app.use(cors({
  origin: (origin: any, callback: any) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json());

// Root route
app.get('/', (req: any, res: any) => {
  res.json({
    message: 'PeerShare Server',
    status: 'running',
    version: '1.0.0',
    socketIO: 'enabled'
  });
});

// Health check route
app.get('/health', (req: any, res: any) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'peershare-api',
    version: '1.0.0'
  });
});

// Start server
server.listen(port, () => {
  console.log('🚀 PeerShare Server started!');
  console.log(`📍 Server URL: http://localhost:${port}`);
  console.log(`🔍 Health Check: http://localhost:${port}/health`);
  console.log(`🔌 WebSocket enabled on same port`);
});