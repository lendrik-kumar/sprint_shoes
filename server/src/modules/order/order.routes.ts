import { Router } from 'express';
import { orderController } from './order.controller';
import { validate } from '@utils/validation';
import { asyncHandler } from '@utils/asyncHandler';
import { authenticate } from '@middleware/authenticate';
import { checkoutSchema, cancelOrderSchema, returnOrderSchema, orderListQuerySchema } from './order.schemas';

const router = Router();

router.use(asyncHandler(authenticate));

router.post('/checkout', validate(checkoutSchema), asyncHandler(orderController.checkout));
router.get('/', validate(orderListQuerySchema, 'query'), asyncHandler(orderController.getOrders));
router.get('/:id', asyncHandler(orderController.getOrderById));
router.post('/cancel/:id', validate(cancelOrderSchema), asyncHandler(orderController.cancelOrder));
router.post('/return/:id', validate(returnOrderSchema), asyncHandler(orderController.returnOrder));

export default router;
