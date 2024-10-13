// src/utils/shutdown.ts
import logger from './loggerE';
import mongoose from 'mongoose';

const shutdown = async () => {
    logger.info('Shutting down server gracefully...');
    try {
        await mongoose.connection.close(false);
        logger.info('MongoDB connection closed.');
        process.exit(0);
    } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
};

export default shutdown;
