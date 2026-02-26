import { apiClient } from '../client';
import { z } from 'zod';

/**
 * Product Service - Client
 */

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  discountPrice: z.number().optional(),
  category: z.string(),
  stock: z.number(),
  images: z.array(z.string()),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  rating: z.number().optional(),
  reviews: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const paginatedProductsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(productSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
  timestamp: z.string(),
});

const productSearchSchema = z.object({
  success: z.boolean(),
  data: z.array(productSchema),
  timestamp: z.string(),
});

export type Product = z.infer<typeof productSchema>;

export class ClientProductService {
  static async getProducts(
    page = 1,
    limit = 10,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    search?: string,
    sort: 'price_asc' | 'price_desc' | 'newest' | 'popular' = 'newest'
  ) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
      ...(categoryId && { categoryId }),
      ...(minPrice !== undefined && { minPrice: String(minPrice) }),
      ...(maxPrice !== undefined && { maxPrice: String(maxPrice) }),
      ...(search && { search }),
    });
    const response = await apiClient.get(`/products?${params}`);
    return paginatedProductsSchema.parse(response.data);
  }

  static async getProductById(id: string) {
    const response = await apiClient.get(`/products/${id}`);
    return z
      .object({
        success: z.boolean(),
        data: productSchema,
      })
      .parse(response.data);
  }

  static async searchProducts(query: string, limit = 10) {
    const params = new URLSearchParams({
      query,
      limit: String(limit),
    });
    const response = await apiClient.get(`/products/search?${params}`);
    return productSearchSchema.parse(response.data);
  }

  static async getFeaturedProducts(limit = 8) {
    const response = await apiClient.get(`/products/featured?limit=${limit}`);
    return z
      .object({
        success: z.boolean(),
        data: z.array(productSchema),
      })
      .parse(response.data);
  }

  static async getProductsByCategory(categoryId: string, limit = 10) {
    const response = await apiClient.get(`/products/category/${categoryId}?limit=${limit}`);
    return z
      .object({
        success: z.boolean(),
        data: z.array(productSchema),
      })
      .parse(response.data);
  }

  static async getRelatedProducts(productId: string, limit = 5) {
    const response = await apiClient.get(`/products/${productId}/related?limit=${limit}`);
    return z
      .object({
        success: z.boolean(),
        data: z.array(productSchema),
      })
      .parse(response.data);
  }

  static async rateProduct(productId: string, rating: number, title: string, comment: string) {
    const response = await apiClient.post(`/products/${productId}/reviews`, {
      rating,
      title,
      comment,
    });
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }
}
