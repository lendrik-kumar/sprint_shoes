import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: UserRole;
      email?: string;
      userAgent?: string;
      requestId?: string;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: UserRole;
  email?: string;
  userAgent?: string;
  requestId?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type AsyncHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => Promise<void | Response>;

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentScenario {
  SUCCESS = 'success',
  FAILURE = 'failure',
  TIMEOUT = 'timeout',
  RETRY = 'retry',
}
