import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface LoggedRequest extends Request {
  startTime?: number;
}

export const requestLogger = (req: LoggedRequest, res: Response, next: NextFunction): void => {
  req.startTime = Date.now();
  
  const { method, url, ip, headers } = req;
  const userAgent = headers['user-agent'] || 'Unknown';
  
  logger.info(`Incoming ${method} ${url}`, {
    ip,
    userAgent,
    timestamp: new Date().toISOString()
  });

  // Log response time when request completes
  res.on('finish', () => {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    const { statusCode } = res;
    
    logger.info(`Completed ${method} ${url}`, {
      statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });

  next();
};

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  const { method, url, ip } = req;
  
  logger.error(`Error in ${method} ${url}`, {
    error: error.message,
    stack: error.stack,
    ip,
    timestamp: new Date().toISOString()
  });

  next(error);
};