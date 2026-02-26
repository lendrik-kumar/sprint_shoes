import { prisma } from '@config/database';
import { NotFoundError } from '@utils/errors';
import { redis, CACHE_KEYS } from '@utils/redis';

export class ProductService {
  async list(filters: any) {
    const cacheKey = CACHE_KEYS.PRODUCTS_LIST(JSON.stringify(filters));
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Scaffold
    const result = { data: [], total: 0, page: filters.page, limit: filters.limit };
    await redis.set(cacheKey, JSON.stringify(result), 300); // 5 min cache
    return result;
  }

  async getById(id: string) {
    const cacheKey = CACHE_KEYS.PRODUCT(id);
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true, variants: { include: { sizes: true } } }
    });

    if (!product) throw new NotFoundError('Product');
    await redis.set(cacheKey, JSON.stringify(product), 3600);
    return product;
  }

  async search(query: string, limit: number) {
    // Scaffold
    return { data: [], total: 0 };
  }

  async getByCategory(categoryId: string, pagination: any) {
    // Scaffold
    return { data: [], total: 0 };
  }

  async getFiltersMeta() {
    // Scaffold
    return { sizes: [], categories: [], priceRange: { min: 0, max: 10000 } };
  }
}

export const productService = new ProductService();
