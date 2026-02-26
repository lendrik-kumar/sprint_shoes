import { create } from 'zustand';
import { Product, Category, ApiError } from '@/types';
import { productApi } from '@/api';

interface Filters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  categories: Category[];
  isLoading: boolean;
  isFetching: boolean;
  error: ApiError | null;
  pagination: { page: number; limit: number; total: number; pages: number } | null;
  filters: Filters;

  fetchProducts: (filters?: Filters) => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  clearError: () => void;
  setSelectedProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  categories: [],
  isLoading: false,
  isFetching: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 12,
  },

  fetchProducts: async (newFilters?: Filters) => {
    const state = get();
    const filters = newFilters || state.filters;
    set({ isLoading: true, error: null });
    try {
      const { data }: any = await productApi.getProducts(filters as any);
      if (data.success) {
        set({
          products: data.data,
          pagination: {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            pages: data.pagination.pages,
          },
          filters,
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({
        error: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch products',
          code: err?.response?.data?.code,
        },
        isLoading: false,
      });
    }
  },

  getProductById: async (id: string) => {
    set({ isFetching: true, error: null });
    try {
      const { data }: any = await productApi.getProductById(id);
      if (data.success) {
        set({
          selectedProduct: data.data,
          isFetching: false,
        });
      }
    } catch (err: any) {
      set({
        error: {
          success: false,
          message: err?.response?.data?.message || 'Failed to fetch product',
          code: err?.response?.data?.code,
        },
        isFetching: false,
      });
      throw err;
    }
  },

  searchProducts: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data }: any = await productApi.searchProducts(query);
      if (data.success) {
        set({
          products: data.data,
          filters: { ...get().filters, search: query, page: 1 },
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({
        error: {
          success: false,
          message: err?.response?.data?.message || 'Search failed',
          code: err?.response?.data?.code,
        },
        isLoading: false,
      });
    }
  },

  setFilters: (newFilters: Partial<Filters>) => {
    const state = get();
    set({
      filters: {
        ...state.filters,
        ...newFilters,
        page: newFilters.page || 1, // Reset to page 1 when filters change
      },
    });
  },

  clearFilters: () => {
    set({
      filters: {
        page: 1,
        limit: 12,
      },
    });
  },

  clearError: () => set({ error: null }),
  setSelectedProduct: (product: Product | null) => set({ selectedProduct: product }),
}));
