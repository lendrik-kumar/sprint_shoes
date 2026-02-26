import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  sizeId: z.string().uuid('Invalid size ID'),
  quantity: z.number().int().min(1).default(1),
});

export const cartItemUpdateSchema = z.object({
  quantity: z.number().int().min(1),
});
