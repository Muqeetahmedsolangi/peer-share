// backend/index.ts
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { initializeSocket } = require('./services/socketService');
const { saveClip, getClip, deleteClip, checkRedisConnection } = require('./services/redisService');

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT) || 4000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = [frontendUrl];

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
server.listen(port, async () => {
  console.log('🚀 PeerShare Server started!');
  console.log(`📍 Server URL: http://localhost:${port}`);
  console.log(`🔍 Health Check: http://localhost:${port}/health`);
  console.log(`🔌 WebSocket enabled on same port`);
  
  // Check Redis connection on startup
  console.log('\n🔍 Checking Redis connection...');
  const redisConnected = await checkRedisConnection();
  if (redisConnected) {
    console.log('✅ Redis connection verified - clip saving is enabled\n');
  } else {
    console.log('⚠️  Redis connection failed - clip saving features will be disabled');
    console.log('   Make sure Redis is installed and running on your server');
    console.log('   Set REDIS_HOST and REDIS_PORT environment variables if needed\n');
  }
});