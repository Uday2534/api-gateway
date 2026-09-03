import dotenv from 'dotenv';

dotenv.config();

export const config = {
  jwtSecret:
    process.env.JWT_SECRET ||
    'local-development-secret',

  redisUrl:
    process.env.REDIS_URL ||
    'redis://localhost:6379',

  rateLimitCapacity:
    Number(process.env.RATE_LIMIT_CAPACITY || 10),

  rateLimitRefillRate:
    Number(process.env.RATE_LIMIT_REFILL_RATE || 0.1667),
};