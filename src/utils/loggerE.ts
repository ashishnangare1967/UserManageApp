// src/utils/logger.ts
import { createLogger, format, transports } from 'winston';
import path from 'path';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }), // Capture stack traces
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'user-management-api' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
  ],
});

// with the colorized simple format.

logger.add(
  new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
  })
);

export default logger;
