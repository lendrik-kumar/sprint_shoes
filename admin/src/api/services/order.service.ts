import { apiClient } from '../client';
import { z } from 'zod';

/**
 * Admin Order Service
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
  userId: z.string(),
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

export type Order = z.infer<typeof orderSchema>;
export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export class AdminOrderService {
  static async getOrders(page = 1, limit = 10, status?: OrderStatus) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(status && { status }),
    });
    const response = await apiClient.get(`/admin/orders?${params}`);
    return paginatedOrdersSchema.parse(response.data);
  }

  static async getOrderById(id: string) {
    const response = await apiClient.get(`/admin/orders/${id}`);
    return z
      .object({
        success: z.boolean(),
        data: orderSchema,
      })
      .parse(response.data);
  }

  static async updateOrderStatus(id: string, status: OrderStatus) {
    const response = await apiClient.patch(`/admin/orders/${id}/status`, { status });
    return z
      .object({
        success: z.boolean(),
        data: orderSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async cancelOrder(id: string, reason: string) {
    const response = await apiClient.post(`/admin/orders/${id}/cancel`, { reason });
    return z
      .object({
        success: z.boolean(),
        data: orderSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async returnOrder(id: string, reason: string) {
    const response = await apiClient.post(`/admin/orders/${id}/return`, { reason });
    return z
      .object({
        success: z.boolean(),
        data: orderSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async getOrderStats(period: 'day' | 'week' | 'month' = 'month') {
    const response = await apiClient.get(`/admin/orders/stats?period=${period}`);
    return z
      .object({
        success: z.boolean(),
        data: z.object({
          totalOrders: z.number(),
          totalRevenue: z.number(),
          averageOrderValue: z.number(),
          statusBreakdown: z.record(z.number()),
        }),
      })
      .parse(response.data);
  }
}
