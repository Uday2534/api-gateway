import { createClient } from 'redis';

import { config } from '../config/env.js';

export const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

await redisClient.connect();

console.log('Connected to Redis');