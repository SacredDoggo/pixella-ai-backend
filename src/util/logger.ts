import winston from 'winston';

// Define log levels for TypeScript
interface LogContext {
  userId?: string;
  operation?: string;
  duration?: number;
  [key: string]: any;
}

export const coreLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'pixella-ai-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

// Type-safe logging methods
export const logger = {
  info: (message: string, context?: LogContext) => coreLogger.info(message, context),
  error: (message: string, context?: LogContext) => coreLogger.error(message, context),
  warn: (message: string, context?: LogContext) => coreLogger.warn(message, context),
  debug: (message: string, context?: LogContext) => coreLogger.debug(message, context),
  http: (message: string, context?: LogContext) => coreLogger.http(message, context),
};