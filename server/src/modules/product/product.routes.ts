import { Router } from 'express';
import { productController } from './product.controller';
import { validate } from '@utils/validation';
import { asyncHandler } from '@utils/asyncHandler';
import { productListQuerySchema, productSearchSchema } from './product.schemas';

const router = Router();

router.get('/', validate(productListQuerySchema, 'query'), asyncHandler(productController.list));
router.get('/search', validate(productSearchSchema, 'query'), asyncHandler(productController.search));
router.get('/filters/meta', asyncHandler(productController.getFiltersMeta));
router.get('/category/:id', validate(productListQuerySchema, 'query'), asyncHandler(productController.getByCategory));
router.get('/:id', asyncHandler(productController.getById));

export default router;
