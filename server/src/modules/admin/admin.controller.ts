import { Response } from 'express';
import { AuthenticatedRequest } from '@types';
import { success, ok } from '@utils/response';
import { prisma } from '@config/database';
import { createAuditLog } from '@utils/auditLog';

export class AdminController {
  // Auth
  public login = async (req: AuthenticatedRequest, res: Response) => {
    res.json(success({ token: 'admin_mock_token' }, 'Admin logged in'));
  };

  // Products
  public createProduct = async (req: AuthenticatedRequest, res: Response) => {
    await createAuditLog({ userId: req.userId!, action: 'CREATE', resource: 'PRODUCT' });
    res.status(201).json(success({ id: 'prod_123', ...req.body }));
  };

  public updateProduct = async (req: AuthenticatedRequest, res: Response) => {
    await createAuditLog({
      userId: req.userId!,
      action: 'UPDATE',
      resource: 'PRODUCT',
      resourceId: req.params.id,
    });
    res.json(success({ id: req.params.id, ...req.body }));
  };

  public deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
    await createAuditLog({
      userId: req.userId!,
      action: 'DELETE',
      resource: 'PRODUCT',
      resourceId: req.params.id,
    });
    res.json(ok('Product deleted'));
  };

  // Inventory
  public updateInventory = async (req: AuthenticatedRequest, res: Response) => {
    await createAuditLog({
      userId: req.userId!,
      action: 'UPDATE',
      resource: 'INVENTORY',
      resourceId: req.params.id,
    });
    res.json(success({ id: req.params.id, stock: req.body.stock }));
  };

  // Orders
  public getOrders = async (req: AuthenticatedRequest, res: Response) => {
    res.json(success({ data: [], total: 0 }));
  };

  public updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
    await createAuditLog({
      userId: req.userId!,
      action: 'UPDATE_STATUS',
      resource: 'ORDER',
      resourceId: req.params.id,
      metadata: { status: req.body.status },
    });
    res.json(success({ id: req.params.id, status: req.body.status }));
  };

  // Users
  public getUsers = async (req: AuthenticatedRequest, res: Response) => {
    res.json(success({ data: [], total: 0 }));
  };

  public updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
    await createAuditLog({
      userId: req.userId!,
      action: 'UPDATE_ROLE',
      resource: 'USER',
      resourceId: req.params.id,
      metadata: { role: req.body.role },
    });
    res.json(success({ id: req.params.id, role: req.body.role }));
  };
}

export const adminController = new AdminController();
