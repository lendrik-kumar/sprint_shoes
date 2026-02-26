import { Request, Response, NextFunction } from 'express';
import xssClean from 'xss-clean';

export const xss = xssClean();

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

const sanitizeObject = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      result[key] = val.replace(/<[^>]*>/g, '');
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = sanitizeObject(val as Record<string, unknown>);
    } else {
      result[key] = val;
    }
  }
  return result;
};
