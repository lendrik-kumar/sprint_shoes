import { Response } from 'express';
import { AuthenticatedRequest } from '@types';
import { success, ok, paginated } from '@utils/response';
import { prisma } from '@config/database';
import { createAuditLog } from '@utils/auditLog';
import { NotFoundError } from '@utils/errors';
import { adminService } from './admin.service';

export class AdminController {
  // ─── Dashboard Stats ─────────────────────────────────────────────────
  public getStats = async (req: AuthenticatedRequest, res: Response) => {
    const [userStats, orderStats, revenue, totalProducts] = await Promise.all([
      adminService.getUserStats(),
      adminService.getOrderStats(),
      adminService.getRevenueSummary(30),
      prisma.product.count({ where: { isActive: true } }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
    });

    res.json(success({
      totalUsers: userStats.totalUsers,
      totalOrders: orderStats.totalOrders,
      totalRevenue: revenue.totalRevenue,
      totalProducts,
      pendingOrders: orderStats.pendingOrders,
      revenueChange: 0,
      ordersChange: 0,
      usersChange: 0,
      recentOrders: recentOrders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.user ? `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim() || o.user.email : 'Unknown',
        amount: o.totalAmount,
        status: o.status,
        date: o.createdAt.toISOString(),
      })),
      salesByCategory: [],
      revenueOverTime: [],
    }));
  };

  // ─── Products ────────────────────────────────────────────────────────
  public getProducts = async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          images: { orderBy: { displayOrder: 'asc' } },
          variants: { include: { sizes: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  };

  public getProductById = async (req: AuthenticatedRequest, res: Response) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { include: { sizes: true } },
      },
    });
    if (!product) throw new NotFoundError('Product');
    res.json(success(product));
  };

  public createProduct = async (req: AuthenticatedRequest, res: Response) => {
    const { name, description, basePrice, discountPrice, discountPercent, sku, categoryId, image, images, variants } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || '',
        basePrice: parseFloat(basePrice),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        discountPercent: discountPercent ? parseFloat(discountPercent) : null,
        sku: sku || `SKU-${Date.now()}`,
        categoryId,
        ...(images?.length && {
          images: {
            create: images.map((url: string, i: number) => ({ url, displayOrder: i })),
          },
        }),
        ...(image && !images?.length && {
          images: {
            create: [{ url: image, displayOrder: 0 }],
          },
        }),
      },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { include: { sizes: true } },
      },
    });

    await createAuditLog({ userId: req.userId!, action: 'CREATE', resource: 'PRODUCT', resourceId: product.id });
    res.status(201).json(success(product, 'Product created successfully'));
  };

  public updateProduct = async (req: AuthenticatedRequest, res: Response) => {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new NotFoundError('Product');

    const { name, description, basePrice, discountPrice, discountPercent, categoryId, image, images, isActive, inStock } = req.body;

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice);
    if (discountPrice !== undefined) updateData.discountPrice = parseFloat(discountPrice);
    if (discountPercent !== undefined) updateData.discountPercent = parseFloat(discountPercent);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isActive !== undefined) updateData.isActive = isActive;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { include: { sizes: true } },
      },
    });

    await createAuditLog({ userId: req.userId!, action: 'UPDATE', resource: 'PRODUCT', resourceId: req.params.id });
    res.json(success(product, 'Product updated successfully'));
  };

  public deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new NotFoundError('Product');

    await prisma.product.delete({ where: { id: req.params.id } });
    await createAuditLog({ userId: req.userId!, action: 'DELETE', resource: 'PRODUCT', resourceId: req.params.id });
    res.json(ok('Product deleted'));
  };

  // ─── Inventory ───────────────────────────────────────────────────────
  public updateInventory = async (req: AuthenticatedRequest, res: Response) => {
    const { quantity } = req.body;
    // Update all sizes for a variant or a specific size
    const variant = await prisma.productVariant.findUnique({
      where: { id: req.params.id },
      include: { sizes: true },
    });
    if (!variant) throw new NotFoundError('Variant');

    await prisma.size.updateMany({
      where: { variantId: req.params.id },
      data: { quantity: parseInt(quantity) },
    });

    await createAuditLog({ userId: req.userId!, action: 'UPDATE', resource: 'INVENTORY', resourceId: req.params.id });
    res.json(success({ id: req.params.id, quantity }, 'Inventory updated'));
  };

  // ─── Orders ──────────────────────────────────────────────────────────
  public getOrders = async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          items: { include: { product: true } },
          payment: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  };

  public getOrderById = async (req: AuthenticatedRequest, res: Response) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        items: { include: { product: true } },
        payment: true,
      },
    });
    if (!order) throw new NotFoundError('Order');
    res.json(success(order));
  };

  public updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        items: { include: { product: true } },
        payment: true,
      },
    });

    await createAuditLog({ userId: req.userId!, action: 'UPDATE_STATUS', resource: 'ORDER', resourceId: req.params.id, metadata: { status } });
    res.json(success(order, 'Order status updated'));
  };

  // ─── Users ───────────────────────────────────────────────────────────
  public getUsers = async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          role: true, isActive: true, createdAt: true, updatedAt: true,
          lastLoginAt: true, phone: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  };

  public getUserById = async (req: AuthenticatedRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, isActive: true, createdAt: true, updatedAt: true,
        lastLoginAt: true, phone: true,
      },
    });
    if (!user) throw new NotFoundError('User');
    res.json(success(user));
  };

  public updateUser = async (req: AuthenticatedRequest, res: Response) => {
    const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new NotFoundError('User');

    const { role, isActive, firstName, lastName } = req.body;
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, isActive: true, createdAt: true, updatedAt: true,
        lastLoginAt: true, phone: true,
      },
    });

    await createAuditLog({ userId: req.userId!, action: 'UPDATE', resource: 'USER', resourceId: req.params.id, metadata: updateData });
    res.json(success(user, 'User updated'));
  };

  public deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new NotFoundError('User');

    await prisma.user.delete({ where: { id: req.params.id } });
    await createAuditLog({ userId: req.userId!, action: 'DELETE', resource: 'USER', resourceId: req.params.id });
    res.json(ok('User deleted'));
  };

  public updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, isActive: true, createdAt: true, updatedAt: true,
      },
    });

    await createAuditLog({ userId: req.userId!, action: 'UPDATE_ROLE', resource: 'USER', resourceId: req.params.id, metadata: { role } });
    res.json(success(user, 'User role updated'));
  };

  // ─── Audit Logs ──────────────────────────────────────────────────────
  public getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await adminService.getAuditLogs(page, limit);

    res.json({
      success: true,
      data: result.logs,
      pagination: { page: result.page, limit: result.limit, total: result.total, pages: Math.ceil(result.total / result.limit) },
    });
  };
}

export const adminController = new AdminController();
