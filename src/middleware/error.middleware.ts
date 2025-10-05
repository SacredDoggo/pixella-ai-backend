import { Request, Response, NextFunction } from 'express';
import { logger } from '../util/logger';

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.error('Unhandled error', {
		error: error.message,
		stack: error.stack,
		url: req.url,
		method: req.method,
		ip: req.ip,
		userAgent: req.get('User-Agent')
	});

	res.status(500).json({
		error: 'Internal server error',
		...(process.env.NODE_ENV === 'development' && { details: error.message })
	});
};