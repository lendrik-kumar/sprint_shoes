import { Router } from 'express';
import { adminController } from './admin.controller';
import { asyncHandler } from '@utils/asyncHandler';
import { authenticate } from '@middleware/authenticate';
import { authorize } from '@middleware/authorize';
import { UserRole } from '@types';

const router = Router();

// Admin Auth (Public for admin login, specific flow)
router.post('/login', asyncHandler(adminController.login));

// Protected Admin Routes
router.use(asyncHandler(authenticate));
router.use(authorize(UserRole.ADMIN, UserRole.SUPERADMIN));

// Products
router.post('/products', asyncHandler(adminController.createProduct));
router.put('/products/:id', asyncHandler(adminController.updateProduct));
router.delete('/products/:id', asyncHandler(adminController.deleteProduct));

// Inventory
router.put('/inventory/:id', asyncHandler(adminController.updateInventory));

// Orders
router.get('/orders', asyncHandler(adminController.getOrders));
router.put('/orders/:id/status', asyncHandler(adminController.updateOrderStatus));

// Users
router.get('/users', asyncHandler(adminController.getUsers));
router.put('/users/:id/role', authorize(UserRole.SUPERADMIN), asyncHandler(adminController.updateUserRole));

export default router;
