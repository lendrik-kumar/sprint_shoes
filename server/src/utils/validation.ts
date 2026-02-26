import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '@utils/errors';

export const validate =
  (schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.errors.forEach((e: ZodError['errors'][number]) => {
        const key = e.path.join('.') || 'root';
        if (!errors[key]) errors[key] = [];
        errors[key].push(e.message);
      });
      throw new ValidationError('Validation failed', errors);
    }
    req[target] = result.data;
    next();
  };

import { z } from 'zod';
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);
export const phoneSchema = z.string().min(10);
