import { useCallback } from 'react';
import { useProductStore } from '@/stores';

interface Filters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
}

export const useProduct = () => {
  const {
    products,
    selectedProduct,
    isLoading,
    isFetching,
    error,
    pagination,
    filters,
    fetchProducts,
    getProductById,
    searchProducts,
    setFilters,
    clearFilters,
    clearError,
    setSelectedProduct,
  } = useProductStore();

  const handleFetchProducts = useCallback(
    async (newFilters?: Filters) => {
      try {
        await fetchProducts(newFilters);
      } catch (err) {
        // Error is handled by the store
      }
    },
    [fetchProducts]
  );

  const handleGetProductById = useCallback(
    async (id: string) => {
      try {
        await getProductById(id);
      } catch (err) {
        throw err;
      }
    },
    [getProductById]
  );

  const handleSearchProducts = useCallback(
    async (query: string) => {
      try {
        await searchProducts(query);
      } catch (err) {
        // Error is handled by the store
      }
    },
    [searchProducts]
  );

  const handleSetFilters = useCallback(
    (newFilters: Partial<Filters>) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  return {
    products,
    selectedProduct,
    isLoading,
    isFetching,
    error,
    pagination,
    filters,
    fetchProducts: handleFetchProducts,
    getProductById: handleGetProductById,
    searchProducts: handleSearchProducts,
    setFilters: handleSetFilters,
    clearFilters: handleClearFilters,
    clearError,
    setSelectedProduct,
  };
};

// Export Filters type for use in components
export type { Filters };
