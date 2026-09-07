import express from 'express';

import { register }
from '../metrics/prometheus.js';

const router = express.Router();

/*
 Prometheus periodically scrapes this endpoint.

 Metrics are pulled, not pushed.
*/
router.get('/', async (req, res) => {
  res.set(
    'Content-Type',
    register.contentType
  );

  res.end(
    await register.metrics()
  );
});

export default router;