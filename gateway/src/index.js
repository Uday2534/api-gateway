import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { routes } from './routes.js';
import { rateLimiter }
from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/auth.js';
import { requestLogger }
from './middleware/requestLogger.js';
import metricsRoutes
from './routes/metricsRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);



/*
 LOGIN ENDPOINT

 This route intentionally remains public because users
 need a way to obtain their first JWT.
*/
app.use('/', authRoutes);
app.use('/gateway/stats', statsRoutes);
app.use('/metrics', metricsRoutes);
/*
 Protect all API traffic before it reaches backend services.

 Requests that fail authentication never consume backend
 resources and never reach application services.
*/
app.use('/api', authenticateToken);
app.use('/api', rateLimiter);

for (const route of routes) {
  app.use(
    route.pathPrefix,
    createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      pathRewrite: route.pathRewrite,

      on: {
        proxyReq: (proxyReq, req) => {

          req.backendService =
            route.pathPrefix.replace(
              '/api/',
              ''
            );

          proxyReq.setHeader(
            'X-User-Id',
            req.user.id
          );

          proxyReq.setHeader(
            'X-User-Role',
            req.user.role
          );
        },

        error: (err, req, res) => {
          console.error(
            `[gateway] proxy error for ${route.target}:`,
            err.message
          );

          res.status(502).json({
            error: 'Bad gateway - backend service unreachable',
          });
        },
      },
    })
  );
}

app.use((req, res) => {
  res.status(404).json({
    error: 'No route matches this path',
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);

  console.log('Routing table:');

  for (const route of routes) {
    console.log(` ${route.pathPrefix} -> ${route.target}`);
  }
});