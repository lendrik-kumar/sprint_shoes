import { prisma } from '@config/database';
import { NotFoundError } from '@utils/errors';

export class ProductService {
  async list(filters: any) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.minPrice || filters.maxPrice) {
      where.basePrice = {};
      if (filters.minPrice) where.basePrice.gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) where.basePrice.lte = parseFloat(filters.maxPrice);
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (filters.sort) {
      case 'price_asc': orderBy = { basePrice: 'asc' }; break;
      case 'price_desc': orderBy = { basePrice: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      case 'popular': orderBy = { createdAt: 'desc' }; break;
    }

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          images: { orderBy: { displayOrder: 'asc' } },
          variants: { include: { sizes: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { include: { sizes: true } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async search(query: string, limit: number) {
    const take = parseInt(String(limit)) || 10;
    const data = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take,
      include: { category: true, images: { orderBy: { displayOrder: 'asc' } } },
    });
    return { data, total: data.length };
  }

  async getByCategory(categoryId: string, pagination: any) {
    const page = parseInt(pagination.page) || 1;
    const limit = parseInt(pagination.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where: { categoryId, isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          images: { orderBy: { displayOrder: 'asc' } },
          variants: { include: { sizes: true } },
        },
      }),
      prisma.product.count({ where: { categoryId, isActive: true } }),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getFiltersMeta() {
    const [categories, priceRange] = await Promise.all([
      prisma.category.findMany({ select: { id: true, name: true, slug: true } }),
      prisma.product.aggregate({
        where: { isActive: true },
        _min: { basePrice: true },
        _max: { basePrice: true },
      }),
    ]);

    const sizes = await prisma.size.findMany({
      distinct: ['size'],
      select: { size: true },
      orderBy: { size: 'asc' },
    });

    return {
      categories,
      sizes: sizes.map((s: any) => s.size),
      priceRange: {
        min: priceRange._min.basePrice ?? 0,
        max: priceRange._max.basePrice ?? 10000,
      },
    };
  }
}

export const productService = new ProductService();
