import { Router } from 'express';
import { cartController } from './cart.controller';
import { validate } from '@utils/validation';
import { asyncHandler } from '@utils/asyncHandler';
import { authenticate } from '@middleware/authenticate';
import { cartItemSchema, cartItemUpdateSchema } from './cart.schemas';

const router = Router();

router.use(asyncHandler(authenticate));

router.get('/', asyncHandler(cartController.getCart));
router.post('/add', validate(cartItemSchema), asyncHandler(cartController.addItem));
router.put('/item/:id', validate(cartItemUpdateSchema), asyncHandler(cartController.updateItem));
router.delete('/item/:id', asyncHandler(cartController.removeItem));
router.delete('/clear', asyncHandler(cartController.clearCart));

export default router;
