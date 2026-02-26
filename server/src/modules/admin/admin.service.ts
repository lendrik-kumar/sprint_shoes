import { prisma } from '@config/database';
import { NotFoundError } from '@utils/errors';

export class AdminService {
  async getUserStats() {
    const [totalUsers, activeUsers, newUsersToday] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return { totalUsers, activeUsers, newUsersToday };
  }

  async getOrderStats() {
    const [totalOrders, pendingOrders, processedToday] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return { totalOrders, pendingOrders, processedToday };
  }

  async getAuditLogs(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count(),
    ]);

    return { logs, total, page, limit };
  }

  async createAuditLog(
    action: string,
    resource: string,
    performedBy: string,
    resourceId?: string,
    metadata?: unknown
  ) {
    return prisma.auditLog.create({
      data: {
        action,
        resource,
        userId: performedBy,
        resourceId,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      },
    });
  }

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User');

    await this.createAuditLog('DELETE_USER', 'User', 'SYSTEM', userId);

    return prisma.user.delete({ where: { id: userId } });
  }

  async deactivateUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User');

    await this.createAuditLog('DEACTIVATE_USER', 'User', 'SYSTEM', userId);

    return prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async getRevenueSummary(days: number = 30) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sinceDate },
        payment: { status: 'COMPLETED' },
      },
      select: { totalAmount: true },
    });

    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return {
      totalRevenue,
      orderCount: orders.length,
      averageOrderValue,
    };
  }
}

export const adminService = new AdminService();
