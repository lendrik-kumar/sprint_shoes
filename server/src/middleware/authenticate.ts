import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '@utils/crypto';
import { redis, CACHE_KEYS } from '@utils/redis';
import { AuthenticationError } from '@utils/errors';
import { AuthenticatedRequest } from '@types';

export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  const isBlacklisted = await redis.exists(CACHE_KEYS.BLACKLIST(token));
  if (isBlacklisted) {
    throw new AuthenticationError('Token has been revoked');
  }

  const payload = verifyAccessToken(token);
  req.userId = payload.userId;
  req.email = payload.email;
  req.role = payload.role;

  next();
};
