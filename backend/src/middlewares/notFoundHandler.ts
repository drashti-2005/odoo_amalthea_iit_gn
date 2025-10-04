import { Request, Response } from 'express';
import { ErrorResponse } from '../types/api';

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ErrorResponse = {
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(response);
};