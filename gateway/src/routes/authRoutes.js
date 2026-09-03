import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

const router = express.Router();

/*
 WHY A MOCK LOGIN?

 The purpose of this phase is to demonstrate gateway-level
 authentication architecture, not user management.

 By issuing tokens for a hardcoded user we can focus on
 authentication flow without introducing databases,
 password hashing, registration flows, etc.
*/

router.post('/login', (req, res) => {
  const testUser = {
    id: 'user-123',
    role: 'user',
  };

  const token = jwt.sign(testUser, config.jwtSecret, {
    expiresIn: '1h',
  });

  res.json({
    message: 'Login successful',
    token,
    user: testUser,
  });
});

export default router;