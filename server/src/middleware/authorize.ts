import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '@types';
import { ForbiddenError, AuthenticationError } from '@utils/errors';

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.userId || !req.role) {
      throw new AuthenticationError();
    }
    if (!allowedRoles.includes(req.role)) {
      throw new ForbiddenError(`Access restricted to: ${allowedRoles.join(', ')}`);
    }
    next();
  };
