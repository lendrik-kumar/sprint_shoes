import { prisma } from '@config/database';
import { NotFoundError, BadRequestError } from '@utils/errors';
import { OrderStatus } from '@types';

export class OrderService {
  async checkout(userId: string, addressId: string, paymentIntentId: string) {
    // Scaffold: Validate stock, decrement, create order, trigger payment confirmation
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber: `ORD-${Date.now()}`,
        status: OrderStatus.PENDING,
        totalAmount: 1000, // Mock
        items: {
          create: [] // Mock
        }
      }
    });
    return order;
  }

  async getOrders(userId: string, pagination: any) {
    // Scaffold
    return { data: [], total: 0 };
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId }});
    if (!order || order.userId !== userId) throw new NotFoundError('Order');
    return order;
  }

  async cancelOrder(userId: string, orderId: string, reason: string) {
    const order = await this.getOrderById(userId, orderId);
    if (![OrderStatus.PENDING, OrderStatus.PROCESSING].includes(order.status as OrderStatus)) {
      throw new BadRequestError('Cannot cancel order in current status');
    }
    
    return prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED, cancelReason: reason, cancelledAt: new Date() }
    });
  }

  async returnOrder(userId: string, orderId: string, reason: string) {
    const order = await this.getOrderById(userId, orderId);
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestError('Only delivered orders can be returned');
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.RETURNED, returnReason: reason, returnedAt: new Date() }
    });
  }
}

export const orderService = new OrderService();
