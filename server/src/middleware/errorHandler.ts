import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '@utils/errors';
import { logger } from '@utils/logger';
import { config } from '@config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    if (err instanceof ValidationError && err.errors) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        code: err.code,
        errors: err.errors,
      });
      return;
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
    return;
  }

  logger.error({ err, url: req.url, method: req.method }, 'Unhandled error');

  res.status(500).json({
    success: false,
    message: config.node_env === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    code: 'NOT_FOUND',
  });
};
