import { Router } from 'express';
import { paymentController } from './payment.controller';
import { validate } from '@utils/validation';
import { asyncHandler } from '@utils/asyncHandler';
import { authenticate } from '@middleware/authenticate';
import { paymentRateLimit } from '@middleware/rateLimit';
import { createIntentSchema, confirmPaymentSchema } from './payment.schemas';

const router = Router();

// Webhook is public (provider calls it)
router.post('/webhook/mock', asyncHandler(paymentController.processWebhook));

// Protected routes
router.use(asyncHandler(authenticate));
router.post('/create-intent', paymentRateLimit, validate(createIntentSchema), asyncHandler(paymentController.createIntent));
router.post('/confirm', paymentRateLimit, validate(confirmPaymentSchema), asyncHandler(paymentController.confirmPayment));
router.get('/status/:id', asyncHandler(paymentController.getStatus));

export default router;
