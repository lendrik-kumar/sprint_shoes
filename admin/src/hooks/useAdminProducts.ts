import { useCallback } from 'react';
import { useProductAdminStore } from '@/stores';
import type { Product } from '@/types';

export const useAdminProducts = () => {
  const {
    products,
    selectedProduct,
    isLoading,
    error,
    pagination,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    clearSelectedProduct,
  } = useProductAdminStore();

  const handleFetchProducts = useCallback(
    async (page?: number, limit?: number) => {
      try {
        await fetchProducts(page, limit);
      } catch (err) {
        console.error('Fetch products error:', err);
      }
    },
    [fetchProducts]
  );

  const handleGetProductById = useCallback(
    async (id: string) => {
      try {
        await getProductById(id);
      } catch (err) {
        console.error('Get product error:', err);
        throw err;
      }
    },
    [getProductById]
  );

  const handleCreateProduct = useCallback(
    async (productData: Partial<Product>) => {
      try {
        await createProduct(productData);
      } catch (err) {
        console.error('Create product error:', err);
        throw err;
      }
    },
    [createProduct]
  );

  const handleUpdateProduct = useCallback(
    async (id: string, productData: Partial<Product>) => {
      try {
        await updateProduct(id, productData);
      } catch (err) {
        console.error('Update product error:', err);
        throw err;
      }
    },
    [updateProduct]
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error('Delete product error:', err);
        throw err;
      }
    },
    [deleteProduct]
  );

  return {
    products,
    selectedProduct,
    isLoading,
    error,
    pagination,
    fetchProducts: handleFetchProducts,
    getProductById: handleGetProductById,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    clearSelectedProduct,
  };
};
