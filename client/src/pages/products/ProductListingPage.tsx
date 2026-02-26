import React, { useEffect, useCallback, memo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { Filter, X, Star, ShoppingCart } from 'lucide-react';
import { useProductStore, useCartStore } from '@/stores';
import type { Product } from '@/types';

const formatINR = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const CATEGORIES = ['sneakers', 'kolhapuris', 'boots', 'formals', 'heels', 'sports'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
];

const ProductCard = memo(({ product }: { product: Product }) => {
  const { addToCart } = useCartStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id, product.variants?.[0]?.id ?? '', 1);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-0.5">
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/300?text=${product.name}`; }}
          />
          {product.discount && product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              -{product.discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-sm font-bold bg-black/60 px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
          {product.inStock && (
            <button
              onClick={handleAdd}
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 bg-orange-600 text-white rounded-xl flex items-center justify-center hover:bg-orange-700"
              aria-label="Quick add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-400 mb-0.5">{product.category?.name}</div>
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">{product.name}</h3>
          {product.rating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">{product.rating} ({product.reviews ?? 0})</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-gray-900 dark:text-white">
              {formatINR(product.discountPrice || product.basePrice)}
            </span>
            {product.discountPrice && product.discountPrice < product.basePrice && (
              <span className="text-xs text-gray-400 line-through">{formatINR(product.basePrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});
ProductCard.displayName = 'ProductCard';

const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 20000]);

  const { products, isLoading, pagination, fetchProducts } = useProductStore();

  const page = parseInt(searchParams.get('page') ?? '1');
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';
  const search = searchParams.get('search') ?? '';

  const updateParam = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    fetchProducts({ page, limit: 12, categoryId: category, sortBy: sort, search, minPrice: priceRange[0], maxPrice: priceRange[1] });
  }, [page, category, sort, search, fetchProducts]);

  const filterPanel = (
    <div className="w-72 p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
        <IconButton size="small" onClick={() => setFilterOpen(false)}><X className="w-4 h-4" /></IconButton>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h4>
        <div className="flex flex-wrap gap-2">
          <Chip
            label="All"
            onClick={() => updateParam('category', '')}
            color={!category ? 'warning' : 'default'}
            size="small"
          />
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c.charAt(0).toUpperCase() + c.slice(1)}
              onClick={() => updateParam('category', c)}
              color={category === c ? 'warning' : 'default'}
              size="small"
            />
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Price: {formatINR(priceRange[0])} – {formatINR(priceRange[1])}
        </h4>
        <Slider
          value={priceRange}
          onChange={(_, v) => setPriceRange(v as [number, number])}
          onChangeCommitted={(_, v) => {
            const [min, max] = v as [number, number];
            const next = new URLSearchParams(searchParams);
            next.set('minPrice', String(min));
            next.set('maxPrice', String(max));
            setSearchParams(next);
          }}
          min={0}
          max={20000}
          step={500}
          valueLabelDisplay="off"
          color="warning"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {search ? `Search: "${search}"` : category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Shoes'}
          </h1>
          {pagination && (
            <p className="text-sm text-gray-500 mt-1">{pagination.total} products found</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              label="Sort by"
              onChange={(e: SelectChangeEvent) => updateParam('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rectangular" height={280} className="rounded-2xl" />
                <Skeleton variant="text" className="mt-2" />
                <Skeleton variant="text" width="50%" />
              </Grid>
            ))
          : products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
      </Grid>

      {!isLoading && products.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👟</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(_, p) => {
              const next = new URLSearchParams(searchParams);
              next.set('page', String(p));
              setSearchParams(next);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            color="standard"
            size="large"
          />
        </div>
      )}

      {/* Filter Drawer */}
      <Drawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)}>
        {filterPanel}
      </Drawer>
    </div>
  );
};

export default ProductListingPage;
