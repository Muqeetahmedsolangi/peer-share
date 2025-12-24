// backend/services/redisService.ts
import Redis from 'ioredis';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB (to support files)
const TTL_SECONDS = 30 * 60; // 30 minutes

// Initialize Redis client with lazy connection
let redis: Redis | null = null;
let redisConnected = false;
let redisInitialized = false;

// Initialize Redis connection (lazy)
function getRedisClient(): Redis | null {
  if (redisInitialized) {
    return redis;
  }

  try {
    // Build Redis options conditionally
    const redisOptions: any = {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      retryStrategy: (times: number) => {
        // Stop retrying after 3 attempts
        if (times > 3) {
          console.log('⚠️ Redis connection failed after 3 attempts. Redis features will be disabled.');
          return null; // Stop retrying
        }
        const delay = Math.min(times * 100, 1000);
        return delay;
      },
      maxRetriesPerRequest: null, // Allow unlimited retries for individual requests
      connectTimeout: 5000, // 5 seconds timeout
      enableReadyCheck: true,
      lazyConnect: true, // Don't connect immediately - connect when needed
      showFriendlyErrorStack: true,
    };

    // Only add password if it exists
    if (process.env.REDIS_PASSWORD) {
      redisOptions.password = process.env.REDIS_PASSWORD;
    }

    redis = new Redis(redisOptions);

    redis.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
      redisConnected = false;
    });

    redis.on('connect', () => {
      console.log('🔌 Redis connecting...');
    });

    redis.on('ready', () => {
      console.log('✅ Redis connected and ready');
      redisConnected = true;
    });

    redis.on('close', () => {
      console.log('⚠️ Redis connection closed');
      redisConnected = false;
    });

    redisInitialized = true;
    return redis;
  } catch (error: any) {
    console.error('❌ Failed to initialize Redis:', error.message);
    redis = null;
    redisInitialized = true;
    return null;
  }
}

// Check connection status
export async function checkRedisConnection(): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    // Try to connect if not connected
    if (!redisConnected) {
      await client.connect();
    }
    await client.ping();
    return true;
  } catch (error) {
    console.error('Redis ping failed:', error);
    return false;
  }
}

interface ClipData {
  clipId: string;
  clipText: string;
  fileName?: string; // For file clips
  fileType?: string; // MIME type for file clips
  isFile?: boolean; // Flag to indicate if this is a file
}

// Save clip to Redis with TTL
export async function saveClip(clipId: string, clipText: string, fileName?: string, fileType?: string): Promise<{ success: boolean; error?: string }> {
  const client = getRedisClient();
  
  if (!client) {
    return {
      success: false,
      error: 'Redis is not configured or unavailable',
    };
  }

  try {
    // Ensure connection
    if (!redisConnected) {
      const isConnected = await checkRedisConnection();
      if (!isConnected) {
        return {
          success: false,
          error: 'Redis server is not available. Please make sure Redis is running (brew services start redis).',
        };
      }
    }

    // Validate size (10MB limit)
    const sizeInBytes = Buffer.byteLength(clipText, 'utf8');
    if (sizeInBytes > MAX_SIZE_BYTES) {
      return {
        success: false,
        error: `Data size (${(sizeInBytes / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit`,
      };
    }

    // Validate base64 encoding
    try {
      Buffer.from(clipText, 'base64');
    } catch (e) {
      return {
        success: false,
        error: 'Invalid base64 encoding',
      };
    }

    const clipData: ClipData = {
      clipId,
      clipText,
      ...(fileName && { fileName }),
      ...(fileType && { fileType }),
      ...(fileName && { isFile: true }),
    };

    // Save to Redis with 30-minute TTL
    const key = `clip:${clipId}`;
    await client.setex(key, TTL_SECONDS, JSON.stringify(clipData));

    console.log(`💾 Saved clip ${clipId} (${(sizeInBytes / 1024).toFixed(2)}KB) with TTL ${TTL_SECONDS}s`);

    return { success: true };
  } catch (error: any) {
    console.error('Error saving clip:', error);
    redisConnected = false; // Mark as disconnected on error
    return {
      success: false,
      error: error.message || 'Failed to save clip. Redis may not be running.',
    };
  }
}

// Check if clip exists in Redis without refreshing TTL (for validation)
export async function checkClipExists(clipId: string): Promise<boolean> {
  const client = getRedisClient();
  
  if (!client || !redisConnected) {
    return false;
  }

  try {
    const key = `clip:${clipId}`;
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error: any) {
    console.error('Error checking clip existence:', error);
    return false;
  }
}

// Get clip from Redis and refresh TTL
export async function getClip(clipId: string, refreshTTL: boolean = true): Promise<{ success: boolean; data?: ClipData; error?: string }> {
  const client = getRedisClient();
  
  if (!client) {
    return {
      success: false,
      error: 'Redis is not configured or unavailable',
    };
  }

  try {
    // Ensure connection
    if (!redisConnected) {
      const isConnected = await checkRedisConnection();
      if (!isConnected) {
        return {
          success: false,
          error: 'Redis server is not available. Please make sure Redis is running (brew services start redis).',
        };
      }
    }

    const key = `clip:${clipId}`;
    const data = await client.get(key);

    if (!data) {
      return {
        success: false,
        error: 'Clip not found or expired',
      };
    }

    const clipData: ClipData = JSON.parse(data);

    // Refresh TTL on access (reset to 30 minutes) only if requested
    if (refreshTTL) {
      await client.expire(key, TTL_SECONDS);
      console.log(`📖 Retrieved clip ${clipId}, TTL refreshed`);
    }

    return {
      success: true,
      data: clipData,
    };
  } catch (error: any) {
    console.error('Error getting clip:', error);
    redisConnected = false; // Mark as disconnected on error
    return {
      success: false,
      error: error.message || 'Failed to retrieve clip. Redis may not be running.',
    };
  }
}

// Delete clip from Redis
export async function deleteClip(clipId: string): Promise<{ success: boolean; error?: string }> {
  const client = getRedisClient();
  
  if (!client) {
    return {
      success: false,
      error: 'Redis is not configured or unavailable',
    };
  }

  try {
    // Ensure connection
    if (!redisConnected) {
      const isConnected = await checkRedisConnection();
      if (!isConnected) {
        return {
          success: false,
          error: 'Redis server is not available. Please make sure Redis is running (brew services start redis).',
        };
      }
    }

    const key = `clip:${clipId}`;
    await client.del(key);
    console.log(`🗑️ Deleted clip ${clipId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting clip:', error);
    redisConnected = false; // Mark as disconnected on error
    return {
      success: false,
      error: error.message || 'Failed to delete clip. Redis may not be running.',
    };
  }
}

// Export for external use
export { getRedisClient as redis };