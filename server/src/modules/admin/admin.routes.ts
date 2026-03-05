import { Router } from 'express';
import { adminController } from './admin.controller';
import { asyncHandler } from '@utils/asyncHandler';
import { authenticate } from '@middleware/authenticate';
import { authorize } from '@middleware/authorize';
import { UserRole } from '@types';

const router = Router();

// Protected Admin Routes
router.use(asyncHandler(authenticate));
router.use(authorize(UserRole.ADMIN, UserRole.SUPERADMIN));

// Dashboard Stats
router.get('/stats', asyncHandler(adminController.getStats));

// Products
router.get('/products', asyncHandler(adminController.getProducts));
router.get('/products/:id', asyncHandler(adminController.getProductById));
router.post('/products', asyncHandler(adminController.createProduct));
router.put('/products/:id', asyncHandler(adminController.updateProduct));
router.delete('/products/:id', asyncHandler(adminController.deleteProduct));

// Inventory
router.put('/inventory/:id', asyncHandler(adminController.updateInventory));

// Orders
router.get('/orders', asyncHandler(adminController.getOrders));
router.get('/orders/:id', asyncHandler(adminController.getOrderById));
router.put('/orders/:id/status', asyncHandler(adminController.updateOrderStatus));

// Users
router.get('/users', asyncHandler(adminController.getUsers));
router.get('/users/:id', asyncHandler(adminController.getUserById));
router.put('/users/:id', asyncHandler(adminController.updateUser));
router.delete('/users/:id', asyncHandler(adminController.deleteUser));
router.put('/users/:id/role', authorize(UserRole.SUPERADMIN), asyncHandler(adminController.updateUserRole));

// Audit Logs
router.get('/audit-logs', asyncHandler(adminController.getAuditLogs));

export default router;
