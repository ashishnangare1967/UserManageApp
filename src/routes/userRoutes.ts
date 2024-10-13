// src/routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Profile (Protected)
router.get('/profile', authMiddleware, getProfile);

export default router;
