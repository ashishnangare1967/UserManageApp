// src/middleware/loggerMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../utils/logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logRequest(req);
  next();
};

export default loggerMiddleware;
