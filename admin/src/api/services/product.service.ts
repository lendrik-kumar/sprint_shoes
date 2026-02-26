import { apiClient } from '../client';
import { z } from 'zod';

/**
 * Admin Product Service
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
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  price: z.number().positive(),
  discountPrice: z.number().optional(),
  categoryId: z.string().uuid(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

const updateProductSchema = createProductSchema.partial();

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

export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export class AdminProductService {
  static async getProducts(page = 1, limit = 10, search?: string) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
    });
    const response = await apiClient.get(`/admin/products?${params}`);
    return paginatedProductsSchema.parse(response.data);
  }

  static async getProductById(id: string) {
    const response = await apiClient.get(`/admin/products/${id}`);
    return z
      .object({
        success: z.boolean(),
        data: productSchema,
      })
      .parse(response.data);
  }

  static async createProduct(data: CreateProductInput) {
    const validated = createProductSchema.parse(data);
    const response = await apiClient.post('/admin/products', validated);
    return z
      .object({
        success: z.boolean(),
        data: productSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async updateProduct(id: string, data: UpdateProductInput) {
    const validated = updateProductSchema.parse(data);
    const response = await apiClient.put(`/admin/products/${id}`, validated);
    return z
      .object({
        success: z.boolean(),
        data: productSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async deleteProduct(id: string) {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return z
      .object({
        success: z.boolean(),
        message: z.string(),
      })
      .parse(response.data);
  }

  static async toggleProductStatus(id: string, isActive: boolean) {
    const response = await apiClient.patch(`/admin/products/${id}/status`, {
      isActive,
    });
    return z
      .object({
        success: z.boolean(),
        data: productSchema,
        message: z.string(),
      })
      .parse(response.data);
  }

  static async updateProductStock(id: string, stock: number) {
    const response = await apiClient.patch(`/admin/products/${id}/stock`, {
      stock,
    });
    return z
      .object({
        success: z.boolean(),
        data: productSchema,
        message: z.string(),
      })
      .parse(response.data);
  }
}
