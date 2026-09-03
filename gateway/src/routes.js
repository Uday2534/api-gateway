// Central place that defines "which path prefix goes to which backend
// service." Keeping this separate from index.js means adding a new service
// later is a one-line change here, not a dig through server setup code.
//
// In a real production gateway, this list might come from a service
// registry (Consul, etcd) so services can register themselves dynamically.
// For this project, a static config is the right amount of complexity -
// it demonstrates the routing PATTERN without building service discovery,
// which is a whole separate (and much bigger) project.

export const routes = [
  {
    // Any request starting with /api/users -> forwarded to the user service
    pathPrefix: '/api/users',
    target: 'http://localhost:4001',
    // Strip the /api/users prefix before forwarding, so the backend
    // service just sees /  or /:id, not /api/users/:id. This keeps
    // backend services simpler and decoupled from gateway-level routing.
    pathRewrite: { '^/api/users': '' },
  },
  {
    pathPrefix: '/api/orders',
    target: 'http://localhost:4002',
    pathRewrite: { '^/api/orders': '' },
  },
  {
    pathPrefix: '/api/products',
    target: 'http://localhost:4003',
    pathRewrite: { '^/api/products': '' },
  },
];
