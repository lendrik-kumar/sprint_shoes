import { z } from 'zod';

export const createIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('INR'),
});

export const confirmPaymentSchema = z.object({
  intentId: z.string().min(1, 'Intent ID is required'),
});
