import client from 'prom-client';

/*
 WHY A CUSTOM REGISTRY?

 A registry is the central place where Prometheus
 collects metrics.

 Keeping metrics definitions together avoids
 scattering monitoring logic throughout the codebase.
*/
const register = new client.Registry();

client.collectDefaultMetrics({
  register,
});

/*
 Total requests processed by the gateway.
*/
export const requestCounter =
  new client.Counter({
    name: 'gateway_requests_total',
    help: 'Total gateway requests',
    labelNames: ['method', 'route', 'status'],
    registers: [register],
  });

/*
 Requests rejected by the rate limiter.
*/
export const rateLimitCounter =
  new client.Counter({
    name: 'gateway_rate_limit_rejections_total',
    help: 'Total rate-limited requests',
    registers: [register],
  });

/*
 Request latency histogram.

 Histograms allow Prometheus to calculate
 p50, p95 and p99 latency.
*/
export const requestLatency =
  new client.Histogram({
    name: 'gateway_request_duration_ms',
    help: 'Gateway request duration',
    labelNames: ['method', 'route'],
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000],
    registers: [register],
  });

export { register };