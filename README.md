# API Gateway with Load Balancing, Distributed Rate Limiting, and Observability

## Overview

This project demonstrates a production-style API Gateway architecture built using Node.js, Express, Redis, NGINX, Docker, Prometheus, and Grafana.

The system routes requests to multiple backend microservices through an API Gateway layer while providing:

* JWT Authentication
* Distributed Token Bucket Rate Limiting
* Load Balancing with NGINX
* Centralized Monitoring with Prometheus
* Real-Time Visualization with Grafana
* Dockerized Deployment

---

## Architecture

```text
                    Client
                       |
                       v
                 +-----------+
                 |   NGINX   |
                 | Load Bal. |
                 +-----------+
                    /     \
                   /       \
                  v         v
          +---------------+ +---------------+
          | Gateway-1     | | Gateway-2     |
          | Express API   | | Express API   |
          +---------------+ +---------------+
                    \      /
                     \    /
                      v  v
                 +-----------+
                 |   Redis   |
                 | Rate Limit|
                 +-----------+
                       |
       ---------------------------------
       |               |               |
       v               v               v
+--------------+ +--------------+ +--------------+
| User Service | | Order Service| |Product Service|
+--------------+ +--------------+ +--------------+
```

---

## Features

### API Gateway

* Centralized request routing
* Reverse proxy functionality
* Route-based service forwarding

### JWT Authentication

* Secure login endpoint
* JWT token generation
* Protected API routes

### Distributed Rate Limiting

* Redis-backed Token Bucket Algorithm
* Shared limits across gateway instances
* Prevents abuse and traffic spikes

### Load Balancing

* NGINX reverse proxy
* Round-robin request distribution
* Multiple gateway instances

### Monitoring & Observability

* Prometheus metrics collection
* Custom application metrics
* Request count tracking
* Response status tracking
* Latency measurement

### Grafana Dashboard

* Request throughput visualization
* Status code monitoring
* Rate limit tracking
* Gateway performance monitoring

### Dockerized Deployment

* Multi-container architecture
* Service orchestration using Docker Compose
* Easy local deployment

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Infrastructure

* Docker
* Docker Compose
* NGINX

### Data Layer

* Redis

### Authentication

* JSON Web Tokens (JWT)

### Monitoring

* Prometheus
* Grafana

---

## Services

### Gateway

Responsible for:

* Authentication
* Rate Limiting
* Request Routing
* Metrics Collection

### User Service

Handles user-related operations.

### Order Service

Handles order-related operations.

### Product Service

Handles product-related operations.

---

## Rate Limiting Strategy

This project uses a Distributed Token Bucket Algorithm.

### Configuration

```env
RATE_LIMIT_CAPACITY=5
RATE_LIMIT_REFILL_RATE=0.1
```

### How It Works

1. Each client receives a token bucket.
2. Every request consumes a token.
3. Tokens are replenished over time.
4. Requests are rejected when the bucket becomes empty.
5. Redis stores bucket state, enabling consistent rate limiting across multiple gateway instances.

---

## Metrics Exposed

Prometheus scrapes:

```text
/metrics
```

Example metrics:

```text
gateway_requests_total
gateway_request_duration_ms
gateway_rate_limited_total
```

---

## Grafana Dashboards

Recommended panels:

### Request Rate

```promql
rate(gateway_requests_total[1m])
```

### Requests by Status

```promql
sum by(status) (
  rate(gateway_requests_total[1m])
)
```

### Average Latency

```promql
rate(gateway_request_duration_ms_sum[1m])
/
rate(gateway_request_duration_ms_count[1m])
```

### Rate Limited Requests

```promql
increase(gateway_rate_limited_total[5m])
```

---

## API Endpoints

### Login

```http
POST /login
```

Response:

```json
{
  "token": "<jwt_token>"
}
```

---

### Users

```http
GET /api/users
```

Requires:

```http
Authorization: Bearer <token>
```

---

### Orders

```http
GET /api/orders
```

Requires:

```http
Authorization: Bearer <token>
```

---

### Products

```http
GET /api/products
```

Requires:

```http
Authorization: Bearer <token>
```

---

## Running the Project

### Clone Repository

```bash
git clone <repository-url>
cd api-gateway-project
```

### Build Containers

```bash
docker compose up --build
```

### Start Services

```bash
docker compose up
```

---

## Access URLs

### API Gateway (via NGINX)

```text
http://localhost:8080
```

### Prometheus

```text
http://localhost:9090
```

### Grafana

```text
http://localhost:3001
```

Default Grafana Credentials:

```text
Username: admin
Password: admin
```

---

## Demonstrated Concepts

* API Gateway Pattern
* Reverse Proxy Architecture
* Distributed Rate Limiting
* Token Bucket Algorithm
* JWT Authentication
* NGINX Load Balancing
* Microservices Communication
* Docker Networking
* Observability & Monitoring
* Production-style Infrastructure Design

---

## Future Improvements

* Gateway Health Checks
* Service Discovery
* Circuit Breaker Pattern
* Distributed Tracing
* Kubernetes Deployment
* Auto Scaling
* API Versioning
* Request Caching
* Service Mesh Integration

---

## Author

Built as a backend systems project to demonstrate distributed systems, microservices architecture, infrastructure engineering, and observability concepts using modern production tools.
