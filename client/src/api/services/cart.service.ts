import { apiClient } from '../client';
import { z } from 'zod';

/**
 * Cart Service - Client
 */

const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number(),
});

const cartSchema = z.object({
  id: z.string(),
  items: z.array(cartItemSchema),
  totalPrice: z.number(),
  totalQuantity: z.number(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
  size?: string;
  color?: string;
}

export class ClientCartService {
  static async getCart() {
    const response = await apiClient.get('/cart');
    return z
      .object({
        success: z.boolean(),
        data: cartSchema,
      })
      .parse(response.data);
  }

  static async addToCart(payload: AddToCartPayload) {
    const response = await apiClient.post('/cart/items', payload);
    return z
      .object({
        success: z.boolean(),
        data: cartSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async updateCartItem(itemId: string, payload: UpdateCartItemPayload) {
    const response = await apiClient.put(`/cart/items/${itemId}`, payload);
    return z
      .object({
        success: z.boolean(),
        data: cartSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async removeFromCart(itemId: string) {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return z
      .object({
        success: z.boolean(),
        data: cartSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async clearCart() {
    const response = await apiClient.post('/cart/clear');
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }

  static async applyCoupon(code: string) {
    const response = await apiClient.post('/cart/coupon', { code });
    return z
      .object({
        success: z.boolean(),
        data: z.object({
          discountAmount: z.number(),
          totalPrice: z.number(),
        }),
        message: z.string(),
      })
      .parse(response.data);
  }

  static async removeCoupon() {
    const response = await apiClient.delete('/cart/coupon');
    return z
      .object({
        success: z.boolean(),
        data: cartSchema,
        message: z.string(),
      })
      .parse(response.data);
  }
}
