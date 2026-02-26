import { apiClient } from '../client';
import { z } from 'zod';

/**
 * Order Service - Client
 */

const orderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
  size: z.string().optional(),
  color: z.string().optional(),
});

const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  items: z.array(orderItemSchema),
  totalPrice: z.number(),
  shippingCost: z.number(),
  tax: z.number(),
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const paginatedOrdersSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(orderSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
  timestamp: z.string(),
});

const addressSchema = z.object({
  id: z.string(),
  type: z.enum(['home', 'work', 'other']),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
  phone: z.string(),
  isDefault: z.boolean(),
});

export type Order = z.infer<typeof orderSchema>;
export type Address = z.infer<typeof addressSchema>;
export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export interface CheckoutPayload {
  addressId: string;
  paymentIntentId: string;
  notes?: string;
}

export interface CreateAddressPayload {
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export class ClientOrderService {
  static async createOrder(payload: CheckoutPayload) {
    const response = await apiClient.post('/orders/checkout', payload);
    return z
      .object({
        success: z.boolean(),
        data: orderSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async getOrders(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await apiClient.get(`/orders?${params}`);
    return paginatedOrdersSchema.parse(response.data);
  }

  static async getOrderById(id: string) {
    const response = await apiClient.get(`/orders/${id}`);
    return z
      .object({
        success: z.boolean(),
        data: orderSchema,
      })
      .parse(response.data);
  }

  static async cancelOrder(id: string, reason: string) {
    const response = await apiClient.post(`/orders/${id}/cancel`, { reason });
    return z
      .object({
        success: z.boolean(),
        data: orderSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async returnOrder(id: string, reason: string) {
    const response = await apiClient.post(`/orders/${id}/return`, { reason });
    return z
      .object({
        success: z.boolean(),
        data: orderSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async trackOrder(orderNumber: string) {
    const response = await apiClient.get(`/orders/track/${orderNumber}`);
    return z
      .object({
        success: z.boolean(),
        data: z.object({
          status: z.enum([
            'PENDING',
            'PROCESSING',
            'SHIPPED',
            'DELIVERED',
            'CANCELLED',
            'RETURNED',
          ]),
          estimatedDelivery: z.string().optional(),
          lastUpdate: z.string(),
        }),
      })
      .parse(response.data);
  }
}

/**
 * Address Service
 */

const paginatedAddressesSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(addressSchema),
    total: z.number(),
  }),
  timestamp: z.string(),
});

export class ClientAddressService {
  static async getAddresses() {
    const response = await apiClient.get('/addresses');
    return paginatedAddressesSchema.parse(response.data);
  }

  static async getAddressById(id: string) {
    const response = await apiClient.get(`/addresses/${id}`);
    return z
      .object({
        success: z.boolean(),
        data: addressSchema,
      })
      .parse(response.data);
  }

  static async createAddress(payload: CreateAddressPayload) {
    const response = await apiClient.post('/addresses', payload);
    return z
      .object({
        success: z.boolean(),
        data: addressSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async updateAddress(id: string, payload: Partial<CreateAddressPayload>) {
    const response = await apiClient.put(`/addresses/${id}`, payload);
    return z
      .object({
        success: z.boolean(),
        data: addressSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async deleteAddress(id: string) {
    const response = await apiClient.delete(`/addresses/${id}`);
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }

  static async setDefaultAddress(id: string) {
    const response = await apiClient.patch(`/addresses/${id}/default`);
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }
}
