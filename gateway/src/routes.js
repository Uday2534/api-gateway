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
    pathPrefix: '/api/users',
    target: process.env.USER_SERVICE_URL || 'http://user-service:4001',
    pathRewrite: { '^/api/users': '' },
  },

  {
    pathPrefix: '/api/orders',
    target: process.env.ORDER_SERVICE_URL || 'http://order-service:4002',
    pathRewrite: { '^/api/orders': '' },
  },

  {
    pathPrefix: '/api/products',
    target: process.env.PRODUCT_SERVICE_URL || 'http://product-service:4003',
    pathRewrite: { '^/api/products': '' },
  },
];