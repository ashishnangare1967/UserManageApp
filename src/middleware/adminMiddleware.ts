// src/middleware/adminMiddleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admins only' });
};

export default adminMiddleware;
