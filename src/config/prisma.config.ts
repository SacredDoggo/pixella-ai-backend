import { PrismaClient } from '@prisma/client';
import { logger } from '../util/logger';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Define proper types for Prisma events
interface QueryEvent {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
}

interface LogEvent {
    timestamp: Date;
    message: string;
    target: string;
}

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'info' },
            { emit: 'event', level: 'warn' },
        ],
    });

(prisma as any).$on('query', (e: QueryEvent) => {
    logger.debug('Database Query', {
        operation: 'query',
        duration: e.duration,
        query: e.query,
        params: e.params,
        timestamp: e.timestamp,
        target: e.target
    });
});

(prisma as any).$on('error', (e: LogEvent) => {
    logger.error('Database Error', {
        operation: 'database',
        message: e.message,
        target: e.target,
        timestamp: e.timestamp
    });
});

(prisma as any).$on('info', (e: LogEvent) => {
    logger.info('Database Info', {
        operation: 'database',
        message: e.message,
        target: e.target,
        timestamp: e.timestamp
    });
});

(prisma as any).$on('warn', (e: LogEvent) => {
    logger.warn('Database Warning', {
        operation: 'database',
        message: e.message,
        target: e.target,
        timestamp: e.timestamp
    });
});

export { prisma };

// Prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;