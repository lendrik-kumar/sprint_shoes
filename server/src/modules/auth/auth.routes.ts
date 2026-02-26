import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '@utils/validation';
import { asyncHandler } from '@utils/asyncHandler';
import { authenticate } from '@middleware/authenticate';
import { authRateLimit } from '@middleware/rateLimit';
import { registerSchema, loginSchema, passwordResetSchema } from './auth.schemas';

const router = Router();

// Public routes
router.post('/register', authRateLimit, validate(registerSchema), asyncHandler(authController.register));
router.post('/login', authRateLimit, validate(loginSchema), asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/verify-email', asyncHandler(authController.verifyEmail));
router.post('/request-password-reset', authRateLimit, asyncHandler(authController.requestPasswordReset));
router.post('/reset-password', validate(passwordResetSchema), asyncHandler(authController.resetPassword));

// Protected routes
router.use(asyncHandler(authenticate));
router.post('/logout', asyncHandler(authController.logout));
router.post('/change-password', asyncHandler(authController.changePassword));
router.get('/me', asyncHandler(authController.me));

export default router;
