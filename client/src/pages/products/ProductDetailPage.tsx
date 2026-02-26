import React, { useEffect, useState, useCallback, memo } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Package, ShieldCheck, Truck } from 'lucide-react';
import { useProductStore, useCartStore } from '@/stores';
import type { ProductVariant } from '@/types';

const formatINR = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

const ProductDetailPage: React.FC = memo(() => {
  const { id } = useParams<{ id: string }>();

  const { selectedProduct, isLoading, getProductById } = useProductStore();
  const { addToCart, isLoading: cartLoading } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (id) getProductById(id);
  }, [id, getProductById]);

  useEffect(() => {
    if (selectedProduct?.variants?.length) {
      setSelectedVariant(selectedProduct.variants[0]);
    }
  }, [selectedProduct]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedProduct || !selectedVariant) return;
    await addToCart(selectedProduct.id, selectedVariant.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [selectedProduct, selectedVariant, quantity, addToCart]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={480} className="rounded-3xl" />
            <div className="flex gap-2 mt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={80}
                  width={80}
                  className="rounded-xl"
                />
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={32} width="40%" className="mt-2" />
            <Skeleton variant="rectangular" height={120} className="mt-4 rounded-xl" />
            <Skeleton variant="rectangular" height={52} className="mt-6 rounded-xl" />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Product not found
          </h2>
          <Link to="/products" className="text-orange-600 hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const images = selectedProduct.images?.length ? selectedProduct.images : [selectedProduct.image];
  const sizes = [...new Set(selectedProduct.variants?.map((v) => v.size))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit" fontSize="small">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/products" underline="hover" color="inherit" fontSize="small">
          Products
        </MuiLink>
        <span className="text-sm text-gray-900 dark:text-white">{selectedProduct.name}</span>
      </Breadcrumbs>

      <Grid container spacing={6}>
        {/* Image Gallery */}
        <Grid item xs={12} md={6}>
          <div className="sticky top-24">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden mb-3">
              <img
                src={images[selectedImage]}
                alt={`${selectedProduct.name} view ${selectedImage + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/480?text=Shoe';
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i
                        ? 'border-orange-600'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <div className="flex items-start justify-between gap-4 mb-2">
            <Chip
              label={selectedProduct.category?.name}
              size="small"
              color="warning"
              variant="outlined"
            />
            <div className="flex gap-2">
              <button
                aria-label="Wishlist"
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                aria-label="Share"
                className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {selectedProduct.name}
          </h1>

          {/* Rating */}
          {selectedProduct.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(selectedProduct.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {selectedProduct.rating} ({selectedProduct.reviews} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatINR(selectedProduct.discountPrice || selectedProduct.basePrice)}
            </span>
            {selectedProduct.discountPrice &&
              selectedProduct.discountPrice < selectedProduct.basePrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatINR(selectedProduct.basePrice)}
                  </span>
                  <Chip label={`${selectedProduct.discount}% OFF`} color="error" size="small" />
                </>
              )}
          </div>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Size</h3>
                <button className="text-xs text-orange-600 hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variant = selectedProduct.variants?.find((v) => v.size === size);
                  const inStock = variant ? variant.stock > 0 : false;
                  return (
                    <button
                      key={size}
                      disabled={!inStock}
                      onClick={() => setSelectedVariant(variant ?? null)}
                      className={`w-12 h-12 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedVariant?.size === size
                          ? 'border-orange-600 bg-orange-600 text-white'
                          : inStock
                            ? 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-orange-400'
                            : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed line-through'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock indicator */}
          {selectedVariant && (
            <div
              className={`mb-4 text-sm font-medium ${selectedVariant.stock > 5 ? 'text-green-600' : selectedVariant.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}
            >
              {selectedVariant.stock > 5
                ? '✓ In Stock'
                : selectedVariant.stock > 0
                  ? `⚠ Only ${selectedVariant.stock} left`
                  : '✗ Out of Stock'}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty:</span>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0 || cartLoading}
            className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
          >
            {cartLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : addedToCart ? (
              '✓ Added to Cart!'
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </>
            )}
          </button>

          {/* Description */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              {selectedProduct.description}
            </p>
          </div>

          {/* Delivery info */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: 'Free delivery above ₹999' },
              { icon: Package, text: 'Easy 30-day returns' },
              { icon: ShieldCheck, text: '100% Authentic' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl text-center"
              >
                <Icon className="w-5 h-5 text-orange-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{text}</span>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  );
});
ProductDetailPage.displayName = 'ProductDetailPage';

export default ProductDetailPage;
