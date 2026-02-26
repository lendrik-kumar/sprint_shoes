import { z } from 'zod';

export const checkoutSchema = z.object({
  addressId: z.string().uuid('Invalid address ID'),
  paymentIntentId: z.string().min(1, 'Payment intent required'),
  notes: z.string().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(1, 'Cancel reason is required'),
});

export const returnOrderSchema = z.object({
  reason: z.string().min(1, 'Return reason is required'),
});

export const orderListQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
});
