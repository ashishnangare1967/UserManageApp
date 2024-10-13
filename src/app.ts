import dotenv from 'dotenv';
dotenv.config();
// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import loggerMiddleware from './middleware/loggerMiddleware';
import loggerE from './utils/loggerE';
import shutdown from './utils/shutdown';
import User from './models/User';

const app = express();

// Middleware
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    loggerE.info("MongoDB connected");

    // Fetch and log recent users on server start
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.find({ createdAt: { $gte: sevenDaysAgo } }).select('name email createdAt');
    console.log('Users registered within the last 7 days:', recentUsers);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Global Unhandled Rejection Handler
process.on('unhandledRejection', (reason: any, p: Promise<any>) => {
  loggerE.error(`${reason} 'src/index.ts Unhandled Rejection at Promise', ${p}`);
  shutdown();
});

// Global Uncaught Exception Handler
process.on('uncaughtException', (err: Error) => {
  loggerE.error(`${err.message} , 'src/index.ts Uncaught Exception thrown'`);
  shutdown();
});

connectDB();

export default app;
