import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { config } from '@config/env';

const createLimiter = (windowMs: number, max: number, message: string): RateLimitRequestHandler =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message, code: 'RATE_LIMIT_EXCEEDED' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.node_env === 'test',
  });

export const generalRateLimit = createLimiter(
  config.rateLimit.windowMs,
  config.rateLimit.maxRequests,
  'Too many requests, please try again later',
);

export const authRateLimit = createLimiter(
  15 * 60 * 1000,
  20,
  'Too many authentication attempts, please try again in 15 minutes',
);

export const otpRateLimit = createLimiter(
  10 * 60 * 1000,
  5,
  'Too many OTP requests, please try again in 10 minutes',
);

export const paymentRateLimit = createLimiter(
  60 * 1000,
  10,
  'Too many payment requests, please slow down',
);

export const strictRateLimit = createLimiter(
  60 * 60 * 1000,
  5,
  'Too many requests for this resource',
);
