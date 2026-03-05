import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Custom hook for fetching products from the real API
 */
export function useProducts(initialFilters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "50");

      if (filters.category && filters.category !== "all") {
        params.set("search", filters.category);
      }
      if (filters.search) {
        params.set("search", filters.search);
      }
      if (filters.minPrice !== undefined) {
        params.set("minPrice", String(filters.minPrice));
      }
      if (filters.maxPrice !== undefined) {
        params.set("maxPrice", String(filters.maxPrice));
      }
      if (filters.sort) {
        const sortMap = {
          "price-low": "price_asc",
          "price-high": "price_desc",
          newest: "newest",
          rating: "popular",
          featured: "newest",
        };
        params.set("sort", sortMap[filters.sort] || "newest");
      }

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        // API returns: { success, data: { data: [...], total, page, limit, pages } }
        const items = Array.isArray(json.data) ? json.data : json.data.data || [];
        // Map DB product shape to the shape the UI expects
        const mapped = items.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.category?.name || "Sprint Shoes",
          category: p.category?.slug || "lifestyle",
          gender: "unisex",
          price: p.discountPrice ?? p.basePrice,
          originalPrice: p.basePrice,
          rating: 4.5,
          reviewCount: 0,
          colors: p.variants?.map((v) => v.value) || [],
          sizes: p.variants?.flatMap((v) => v.sizes?.map((s) => s.size)) || [],
          images: p.images?.map((img) => img.url) || ["/assets/shoes/shoe-5.avif"],
          thumbnail: p.images?.[0]?.url || "/assets/shoes/shoe-5.avif",
          description: p.description || "",
          features: [],
          isNew: true,
          isBestseller: false,
          inStock: p.isActive !== false,
          tags: [],
        }));
        setProducts(mapped);
        setTotal(json.data.total || mapped.length);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ category: "all", sort: "featured" });
  }, []);

  return {
    products,
    loading,
    error,
    total,
    filters,
    updateFilters,
    resetFilters,
    setFilters,
    refetch: fetchProducts,
  };
}

/**
 * Custom hook for fetching a single product
 */
export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/products/${productId}`);
        const json = await res.json();

        if (json.success && json.data) {
          const p = json.data;
          setProduct({
            id: p.id,
            name: p.name,
            brand: p.category?.name || "Sprint Shoes",
            category: p.category?.slug || "lifestyle",
            gender: "unisex",
            price: p.discountPrice ?? p.basePrice,
            originalPrice: p.basePrice,
            rating: 4.5,
            reviewCount: p.reviews?.length || 0,
            colors: p.variants?.map((v) => v.value) || [],
            sizes: p.variants?.flatMap((v) => v.sizes?.map((s) => s.size)) || [],
            images: p.images?.map((img) => img.url) || ["/assets/shoes/shoe-5.avif"],
            thumbnail: p.images?.[0]?.url || "/assets/shoes/shoe-5.avif",
            description: p.description || "",
            features: [],
            isNew: true,
            isBestseller: false,
            inStock: p.isActive !== false,
            tags: [],
          });
        } else {
          setProduct(null);
          setError("Product not found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}

/**
 * Custom hook for fetching related products
 */
export function useRelatedProducts(productId, limit = 4) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products?limit=${limit}`);
        const json = await res.json();
        if (json.success && json.data) {
          const items = Array.isArray(json.data) ? json.data : json.data.data || [];
          const mapped = items
            .filter((p) => p.id !== productId)
            .slice(0, limit)
            .map((p) => ({
              id: p.id,
              name: p.name,
              brand: p.category?.name || "Sprint Shoes",
              category: p.category?.slug || "lifestyle",
              price: p.discountPrice ?? p.basePrice,
              originalPrice: p.basePrice,
              rating: 4.5,
              images: p.images?.map((img) => img.url) || ["/assets/shoes/shoe-5.avif"],
              thumbnail: p.images?.[0]?.url || "/assets/shoes/shoe-5.avif",
              inStock: p.isActive !== false,
            }));
          setProducts(mapped);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [productId, limit]);

  return { products, loading };
}
