// src/routes/adminRoutes.ts
import express from 'express';
import { createUserByAdmin, getAllUsers, updateUser, deleteUser } from '../controllers/adminController';
import authMiddleware from '../middleware/authMiddleware';
import adminMiddleware from '../middleware/adminMiddleware';

const router = express.Router();

// Apply authentication and admin middleware to all admin routes
router.use(authMiddleware, adminMiddleware);

// Create user
router.post('/users', createUserByAdmin);

// Get all users with pagination and filters
router.get('/users', getAllUsers);

// Update user
router.put('/users/:id', updateUser);

// Delete user
router.delete('/users/:id', deleteUser);

export default router;
