import { Router } from 'express';
import { userController } from './user.controller';
import { validate } from '@utils/validation';
import { asyncHandler } from '@utils/asyncHandler';
import { authenticate } from '@middleware/authenticate';
import { updateProfileSchema, addressSchema } from './user.schemas';

const router = Router();

router.use(asyncHandler(authenticate));

router.get('/profile', asyncHandler(userController.getProfile));
router.put('/profile', validate(updateProfileSchema), asyncHandler(userController.updateProfile));
router.delete('/account', asyncHandler(userController.deleteAccount));

router.get('/addresses', asyncHandler(userController.getAddresses));
router.post('/addresses', validate(addressSchema), asyncHandler(userController.addAddress));
router.put('/addresses/:id', validate(addressSchema), asyncHandler(userController.updateAddress));
router.delete('/addresses/:id', asyncHandler(userController.deleteAddress));

export default router;
