import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

import { redisClient } from '../redis/client.js';
import { config } from '../config/env.js';
import { stats } from '../metrics/stats.js';
const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const luaScript = fs.readFileSync(
  path.join(
    __dirname,
    '../redis/tokenBucket.lua'
  ),
  'utf8'
);

/*
 WHY PER-USER LIMITS?

 Authenticated traffic should be limited
 by user identity rather than IP.

 Multiple users behind the same NAT should
 not affect each other's limits.
*/
export async function rateLimiter(
  req,
  res,
  next
) {
  try {
    const identifier =
      req.user?.id || req.ip;

    const key =
      `bucket:${identifier}`;

    const nowSeconds =
      Date.now() / 1000;

    const result =
      await redisClient.eval(
        luaScript,
        {
          keys: [key],
          arguments: [
            String(
              config.rateLimitCapacity
            ),
            String(
              config.rateLimitRefillRate
            ),
            String(nowSeconds),
          ],
        }
      );
      
    console.log('RATE LIMIT RESULT:', result);
    console.log('TYPE:', typeof result);
    console.log('IS ARRAY:', Array.isArray(result));

    const allowed = result[0];
    const retryAfter = result[1];

    if (!allowed) {

        stats.rateLimitRejections++;

        res.set(
            'Retry-After',
            String(retryAfter)
        );

        return res.status(429).json({
            error: 'Rate limit exceeded',
        });
    }

    next();
  } catch (error) {
    console.error(
      'Rate limiter error:',
      error
    );

    next();
  }
}