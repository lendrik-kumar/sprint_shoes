import { z } from 'zod';
import { UserRole, OrderStatus, PaymentStatus } from '@types';

/**
 * Common Response Schemas
 */

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  role: z.nativeEnum(UserRole),
  isEmailVerified: z.boolean(),
  isPhoneVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userSchema,
});

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  category: z.string(),
  categoryId: z.string().uuid(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string()),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const cartItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  product: productSchema.optional(),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().positive(),
  createdAt: z.string().datetime(),
});

export const cartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  items: z.array(cartItemSchema),
  totalPrice: z.number().nonnegative(),
  totalQuantity: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const addressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['home', 'work', 'other']),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
  phone: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  product: productSchema.optional(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const orderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  orderNumber: z.string(),
  items: z.array(orderItemSchema),
  totalPrice: z.number().nonnegative(),
  status: z.nativeEnum(OrderStatus),
  shippingAddress: addressSchema.optional(),
  shippingCost: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const paymentSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  amount: z.number().positive(),
  status: z.nativeEnum(PaymentStatus),
  method: z.enum(['card', 'upi', 'netbanking', 'wallet']),
  transactionId: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const reviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().min(0).max(5),
  title: z.string(),
  comment: z.string(),
  images: z.array(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * API Response Wrappers
 */

export const successResponseSchema = <T extends z.ZodSchema>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  });

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.string(),
    details: z.any().optional(),
  }),
  timestamp: z.string().datetime(),
});

export const paginatedResponseSchema = <T extends z.ZodSchema>(itemSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.object({
      items: z.array(itemSchema),
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      pages: z.number().int().nonnegative(),
    }),
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  });

/**
 * Export types for TypeScript
 */
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type Review = z.infer<typeof reviewSchema>;
