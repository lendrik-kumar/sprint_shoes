import { z } from 'zod';

export const productListQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  size: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular']).default('newest'),
});

export const productSearchSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
});
