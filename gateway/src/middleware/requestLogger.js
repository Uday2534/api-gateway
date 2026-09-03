import { logger } from '../logger/logger.js';
import { stats } from '../metrics/stats.js';

/*
 WHY LOG ON RESPONSE FINISH?

 Logging before the request completes means
 we don't yet know:

 - final status code
 - latency
 - whether an error occurred

 The finish event guarantees we have the
 complete picture.
*/

export function requestLogger(req, res, next) {
  const start = Date.now();

  stats.totalRequests++;

  res.on('finish', () => {
    const latencyMs = Date.now() - start;

    if (res.statusCode >= 400) {
      stats.errorRequests++;
    } else {
      stats.successfulRequests++;
    }

    logger.info({
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      latencyMs,

      backendService:
        req.backendService || null,

      rateLimited:
        res.statusCode === 429,
    });
  });

  next();
}