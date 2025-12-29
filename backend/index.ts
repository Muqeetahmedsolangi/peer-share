// backend/index.ts
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { initializeSocket } = require('./services/socketService');
const { saveClip, getClip, deleteClip, checkRedisConnection } = require('./services/redisService');
const roomController = require('./controllers/roomCOntroller');

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT) || 4000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = [
  frontendUrl,
  'https://api.dropsos.com',
  'http://api.dropsos.com',
  'https://www.dropsos.com',
  'http://www.dropsos.com'
];

// Trust proxy for correct IP detection behind nginx/reverse proxy
// Enable trust proxy for VPS deployment with nginx
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

// Initialize Socket.IO
initializeSocket(server);

// Middleware
app.use(cors({
  origin: (origin: any, callback: any) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin && (
      origin.includes('localhost') || 
      origin.includes('127.0.0.1') ||
      origin.includes('192.168.') ||
      origin.includes('10.0.') ||
      origin.includes('172.16.')
    )) {
      return callback(null, true);
    }
    
    console.log('🚫 CORS blocked origin:', origin);
    return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Add request logging for debugging
app.use((req: any, _res: any, next: any) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} - Origin: ${req.get('origin') || 'none'}`);
  next();
});

// Root route
app.get('/', (_req: any, res: any) => {
  res.json({
    message: 'PeerShare Server',
    status: 'running',
    version: '1.0.0',
    socketIO: 'enabled'
  });
});

// Health check route
app.get('/health', (_req: any, res: any) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'peershare-api',
    version: '1.0.0'
  });
});

// Room routes
app.post('/api/rooms/create', roomController.createRoom);
app.post('/api/rooms/validate', roomController.validateRoom);
app.post('/api/rooms/join', roomController.joinRoom);

// Start server
server.listen(port, '0.0.0.0', async () => {
  console.log('🚀 PeerShare Server started!');
  console.log(`📍 Server URL: http://localhost:${port}`);
  console.log(`🔍 Health Check: http://localhost:${port}/health`);
  console.log(`🔌 WebSocket enabled on same port`);
  console.log(`🌐 Binding to 0.0.0.0:${port} for VPS deployment`);
  
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