import { create } from 'zustand';
import type { Product, ApiError } from '@/types';
import { adminProductApi } from '@/api';

type Pagination = { page: number; limit: number; total: number; pages: number };

interface ProductAdminState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: ApiError | null;
  pagination: Pagination | null;

  fetchProducts: (page?: number, limit?: number, search?: string) => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearSelectedProduct: () => void;
  clearError: () => void;
}

const handleError = (err: unknown): ApiError => {
  const e = err as { response?: { data?: { message?: string; code?: string } } };
  return {
    success: false,
    message: e?.response?.data?.message ?? 'An error occurred',
    code: e?.response?.data?.code,
  };
};

export const useProductAdminStore = create<ProductAdminState>((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchProducts: async (page = 1, limit = 10, search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminProductApi.getProducts(page, limit, search);
      if (data.success) {
        set({
          products: data.data,
          pagination: data.pagination,
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
    }
  },

  getProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminProductApi.getProductById(id);
      if (data.success) set({ selectedProduct: data.data, isLoading: false });
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  createProduct: async (productData: Partial<Product>) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminProductApi.createProduct(productData);
      if (data.success) {
        set({ products: [data.data, ...get().products], selectedProduct: data.data, isLoading: false });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminProductApi.updateProduct(id, productData);
      if (data.success) {
        set({
          products: get().products.map((p) => (p.id === id ? data.data : p)),
          selectedProduct: data.data,
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await adminProductApi.deleteProduct(id);
      if (data.success) {
        set({
          products: get().products.filter((p) => p.id !== id),
          selectedProduct: get().selectedProduct?.id === id ? null : get().selectedProduct,
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: handleError(err), isLoading: false });
      throw err;
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),
  clearError: () => set({ error: null }),
}));
