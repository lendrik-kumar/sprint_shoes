import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import productRoutes from '../modules/product/product.routes';
import cartRoutes from '../modules/cart/cart.routes';
import orderRoutes from '../modules/order/order.routes';
import paymentRoutes from '../modules/payment/payment.routes';
import adminRoutes from '../modules/admin/admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

export default router;
