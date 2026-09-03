import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/*
 WHY VALIDATE AT THE GATEWAY?

 In a microservice architecture, every incoming request already
 passes through the gateway.

 If every backend service independently validates JWTs:

 - duplicated code
 - duplicated secrets
 - inconsistent auth behavior

 Validating once at the gateway creates a trusted boundary.

 Services can trust headers injected by the gateway and focus
 only on business logic.
*/

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Authorization header missing',
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Invalid authorization format',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
}