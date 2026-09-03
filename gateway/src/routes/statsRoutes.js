import express from 'express';
import { stats } from '../metrics/stats.js';

const router = express.Router();

router.get('/', (req, res) => {
  const uptimeSeconds =
    Math.floor(
      (Date.now() - stats.startTime) / 1000
    );

  const errorRate =
    stats.totalRequests === 0
      ? 0
      : (
          stats.errorRequests /
          stats.totalRequests
        ) * 100;

  res.json({
    totalRequests: stats.totalRequests,
    successfulRequests: stats.successfulRequests,
    errorRequests: stats.errorRequests,
    rateLimitRejections: stats.rateLimitRejections,
    errorRate: Number(errorRate.toFixed(2)),
    uptimeSeconds,
  });
});

export default router;