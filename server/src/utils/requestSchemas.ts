import { z } from 'zod';

/**
 * Global Request Schema
 */
export const authHeaderSchema = z.object({
  authorization: z.string().startsWith('Bearer ', 'Invalid token format'),
});

/**
 * Common Query Schemas
 */
export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
});

/**
 * Auth Schemas
 */
export const registerRequestSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

export const loginRequestSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password required'),
  }),
});

export const refreshTokenRequestSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token required'),
  }),
});

export const changePasswordRequestSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

export const passwordResetRequestSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const requestPasswordResetSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

/**
 * Product Schemas
 */
export const createProductRequestSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    discountPrice: z.number().positive().optional(),
    categoryId: z.string().uuid('Invalid category ID'),
    stock: z.number().int().nonnegative('Stock must be non-negative'),
    images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image required'),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
  }),
});

export const updateProductRequestSchema = createProductRequestSchema.partial();

export const productQuerySchema = paginationQuerySchema.extend({
  categoryId: z.string().optional(),
  search: z.string().optional(),
  minPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .optional(),
  size: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular']).default('newest'),
});

export const productSearchSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
});

/**
 * Cart Schemas
 */
export const addToCartRequestSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
    size: z.string().optional(),
    color: z.string().optional(),
  }),
});

export const updateCartItemRequestSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive('Quantity must be positive'),
    size: z.string().optional(),
    color: z.string().optional(),
  }),
});

export const applyCouponRequestSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code required'),
  }),
});

/**
 * Order Schemas
 */
export const checkoutRequestSchema = z.object({
  body: z.object({
    addressId: z.string().uuid('Invalid address ID'),
    paymentIntentId: z.string().min(1, 'Payment intent required'),
    notes: z.string().optional(),
  }),
});

export const cancelOrderRequestSchema = z.object({
  body: z.object({
    reason: z.string().min(1, 'Cancel reason is required'),
  }),
});

export const returnOrderRequestSchema = z.object({
  body: z.object({
    reason: z.string().min(1, 'Return reason is required'),
  }),
});

export const orderQuerySchema = paginationQuerySchema.extend({
  status: z
    .enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'])
    .optional(),
});

/**
 * Address Schemas
 */
export const createAddressRequestSchema = z.object({
  body: z.object({
    type: z.enum(['home', 'work', 'other']),
    street: z.string().min(1, 'Street required'),
    city: z.string().min(1, 'City required'),
    state: z.string().min(1, 'State required'),
    zipCode: z.string().min(1, 'Zip code required'),
    country: z.string().min(1, 'Country required'),
    phone: z.string().min(10, 'Invalid phone number'),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressRequestSchema = createAddressRequestSchema.partial();

/**
 * User Schemas (Admin)
 */
export const updateUserRequestSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

export const changeUserRoleRequestSchema = z.object({
  body: z.object({
    role: z.enum(['CUSTOMER', 'ADMIN', 'SUPERADMIN']),
  }),
});

export const toggleUserStatusRequestSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

/**
 * Review Schemas
 */
export const createReviewRequestSchema = z.object({
  body: z.object({
    rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
    title: z.string().min(1, 'Title required'),
    comment: z.string().min(10, 'Comment must be at least 10 characters'),
    images: z.array(z.string().url()).optional(),
  }),
});

/**
 * Admin Dashboard Schemas
 */
export const adminStatsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month']).default('month'),
});

export const updateProductStatusRequestSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const updateProductStockRequestSchema = z.object({
  body: z.object({
    stock: z.number().int().nonnegative('Stock must be non-negative'),
  }),
});

/**
 * Export types
 */
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type CreateProductRequest = z.infer<typeof createProductRequestSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductRequestSchema>;
export type AddToCartRequest = z.infer<typeof addToCartRequestSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CreateAddressRequest = z.infer<typeof createAddressRequestSchema>;
export type CreateReviewRequest = z.infer<typeof createReviewRequestSchema>;
