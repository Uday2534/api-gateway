# api-gateway-project

**Phase 1: Routing.** A gateway that proxies requests to three backend
services based on path prefix.

## Structure
```
gateway/                # the actual project - API gateway
  src/
    index.js            # server setup + proxy registration
    routes.js           # routing config (path prefix -> target service)
services/                # dummy backend services (just routing targets)
  user-service/
  order-service/
  product-service/
```

## Run it (4 terminals needed - or use tmux/background processes)

### 1. Install dependencies (once per folder)
```bash
cd gateway && npm install
cd ../services/user-service && npm install
cd ../order-service && npm install
cd ../product-service && npm install
```

### 2. Start each service (each in its own terminal)
```bash
cd services/user-service && npm start      # port 4001
cd services/order-service && npm start     # port 4002
cd services/product-service && npm start   # port 4003
```

### 3. Start the gateway
```bash
cd gateway && npm start                    # port 3000
```

You should see the routing table printed on startup:
```
API Gateway listening on port 3000
Routing table:
  /api/users -> http://localhost:4001
  /api/orders -> http://localhost:4002
  /api/products -> http://localhost:4003
```

## Test it
```bash
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users/1
curl http://localhost:3000/api/orders
curl http://localhost:3000/api/products/2
curl http://localhost:3000/api/nonexistent   # should 404 from the gateway itself
```

Each response includes a `"service"` field showing which backend actually
handled it - useful for confirming routing is working correctly, and for
your own sanity while debugging.

Watch the gateway terminal's logs while you curl - you'll see each request
logged and which backend it got forwarded to.

## Next phases (see project roadmap)
- Phase 2: JWT auth at the gateway
- Phase 3: Redis-backed rate limiting (the core of the project)
- Phase 4: Structured logging
- Phase 5: Docker Compose + benchmarking
