import { NextFunction, Response } from 'express';
import { AuthenticatedRequest, AsyncHandler } from '../types';
import { AppError } from './errors';
import { logger } from './logger';

export const asyncHandler =
  (handler: AsyncHandler) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: {
            code: error.code,
            details: (error as any).details,
          },
          timestamp: (error as any).timestamp || new Date().toISOString(),
        });
      } else if (error instanceof Error) {
        logger.error({ error }, 'Unexpected error in request handler');
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: {
            code: 'INTERNAL_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          },
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: {
            code: 'INTERNAL_ERROR',
          },
          timestamp: new Date().toISOString(),
        });
      }
    }
  };
