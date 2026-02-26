import React, { useState } from 'react';
import { Link } from '../hooks/useRouter.jsx';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';
import ProductGrid from './ProductGrid';
import {
  Star,
  Heart,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Share2,
  ChevronLeft,
  Package,
  ShoppingBag,
  Zap,
} from 'lucide-react';

/**
 * ProductDetail Component
 * Full product detail page with image gallery, size selection, and related products
 */
const ProductDetail = ({ productId }) => {
  const { product, loading, error } = useProduct(productId);
  const { products: relatedProducts, loading: relatedLoading } = useRelatedProducts(productId, 4);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-neutral-400" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Product Not Found</h2>
          <p className="text-neutral-600 mb-8 max-w-md">
            {error || "The product you're looking for doesn't exist or may have been removed."}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    // TODO: Integrate with cart backend
    alert(`Added ${quantity} x ${product.name} (Size ${selectedSize}) to cart!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    // TODO: Integrate with checkout backend
    // Redirect to checkout page
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm animate-fade-in">
          <Link href="/" className="text-neutral-500 hover:text-amber-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          <Link
            href="/products"
            className="text-neutral-500 hover:text-amber-600 transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          <Link
            href={`/products?category=${product.category}`}
            className="text-neutral-500 hover:text-amber-600 transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-900 font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4 animate-slide-up">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl bg-neutral-100 overflow-hidden shadow-lg">
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-4 py-2 text-sm font-bold bg-amber-500 text-neutral-900 rounded-full shadow-lg">
                    ✨ NEW
                  </span>
                )}
                {product.isBestseller && (
                  <span className="px-4 py-2 text-sm font-bold bg-neutral-900 text-white rounded-full shadow-lg">
                    🔥 BESTSELLER
                  </span>
                )}
                {discount && (
                  <span className="px-4 py-2 text-sm font-bold bg-rose-500 text-white rounded-full shadow-lg">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Share Button */}
              <button className="absolute top-5 right-5 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all">
                <Share2 className="w-5 h-5 text-neutral-700" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 px-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all shadow-md ${
                      selectedImage === index
                        ? 'border-amber-500 scale-105'
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div
            className="space-y-6 animate-slide-up stagger-1"
            style={{ animationFillMode: 'backwards' }}
          >
            {/* Brand & Name */}
            <div>
              <p className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-3">
                {product.brand}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-neutral-200 text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-neutral-600">
                  {product.rating} · {product.reviewCount} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 py-4 px-5 bg-neutral-50 rounded-2xl">
              <span className="text-3xl font-bold text-neutral-900">
                ₹{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-neutral-400 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="px-3 py-1.5 text-sm font-bold bg-rose-100 text-rose-600 rounded-full">
                    Save ₹{(product.originalPrice - product.price).toFixed(0)}
                  </span>
                </>
              )}
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-3">
                  Color:{' '}
                  <span className="font-normal text-neutral-600 capitalize">
                    {product.colors[selectedColor]}
                  </span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-12 h-12 rounded-xl border-3 transition-all shadow-md ${
                        selectedColor === index
                          ? 'border-amber-500 scale-110 ring-2 ring-amber-200'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                      style={{ backgroundColor: getColorHex(color) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-neutral-900">Select Size</h3>
                <button className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
                  📏 Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3.5 text-sm font-bold rounded-xl border-2 transition-all ${
                      selectedSize === size
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-amber-500 hover:text-amber-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Quantity</h3>
              <div className="inline-flex items-center border-2 border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 text-center font-bold min-w-[60px] border-x-2 border-neutral-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-base font-bold rounded-xl transition-all ${
                  product.inStock
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl'
                    : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-rose-300 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now */}
            {product.inStock && (
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 text-base font-bold text-neutral-900 bg-amber-500 rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/30"
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <Truck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">Free Delivery</p>
                  <p className="text-xs text-neutral-500">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                <div className="p-2.5 bg-green-100 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">30-Day Returns</p>
                  <p className="text-xs text-neutral-500">Easy returns</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                <div className="p-2.5 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">Secure Payment</p>
                  <p className="text-xs text-neutral-500">100% protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20 border-t border-neutral-200 pt-12">
          <div className="flex gap-8 border-b border-neutral-200 overflow-x-auto">
            {['description', 'features', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold capitalize whitespace-nowrap border-b-3 transition-all ${
                  activeTab === tab
                    ? 'text-amber-600 border-amber-500'
                    : 'text-neutral-500 border-transparent hover:text-neutral-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-10">
            {activeTab === 'description' && (
              <div className="max-w-3xl animate-fade-in">
                <p className="text-neutral-700 leading-relaxed text-lg">{product.description}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="max-w-3xl animate-fade-in">
                <ul className="space-y-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl animate-fade-in">
                <div className="flex items-center gap-6 mb-8 p-6 bg-amber-50 rounded-2xl">
                  <div className="text-5xl font-bold text-neutral-900">{product.rating}</div>
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-neutral-200 text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-neutral-600">
                      Based on {product.reviewCount} reviews
                    </p>
                  </div>
                </div>
                <p className="text-neutral-500 text-center py-8">
                  Reviews will be loaded from the backend. Connect to your reviews API to display
                  customer feedback.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-neutral-200 pt-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">
              You May Also <span className="text-amber-500">Like</span>
            </h2>
            <ProductGrid products={relatedProducts} loading={relatedLoading} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
};

// Color helper
function getColorHex(colorName) {
  const colorMap = {
    black: '#1a1a1a',
    white: '#FFFFFF',
    navy: '#1a365d',
    red: '#dc2626',
    blue: '#2563eb',
    green: '#16a34a',
    brown: '#78350f',
    pink: '#ec4899',
    beige: '#d4b896',
    coral: '#ff7f50',
    mint: '#98ff98',
    'neon-yellow': '#ccff00',
    lavender: '#e6e6fa',
    cream: '#fffdd0',
    grey: '#6b7280',
    gray: '#6b7280',
    sage: '#9dc183',
    blush: '#de5d83',
    charcoal: '#36454f',
    burgundy: '#800020',
    'black-gold': '#1a1a1a',
    'white-red': '#FFFFFF',
    canvas: '#f5f5dc',
  };
  return colorMap[colorName.toLowerCase()] || '#cccccc';
}

// Loading skeleton
const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-6 bg-neutral-200 rounded-full w-1/3 mb-8 animate-shimmer" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="space-y-4">
          <div className="aspect-square bg-neutral-100 rounded-3xl animate-shimmer" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-neutral-100 rounded-xl animate-shimmer" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-4 bg-neutral-100 rounded-full w-1/4 animate-shimmer" />
          <div className="h-10 bg-neutral-100 rounded-full w-3/4 animate-shimmer" />
          <div className="h-6 bg-neutral-100 rounded-full w-1/3 animate-shimmer" />
          <div className="h-16 bg-neutral-50 rounded-2xl animate-shimmer" />
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-12 h-12 bg-neutral-100 rounded-xl animate-shimmer" />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded-xl animate-shimmer" />
            ))}
          </div>
          <div className="h-14 bg-neutral-100 rounded-xl animate-shimmer" />
          <div className="h-14 bg-amber-100 rounded-xl animate-shimmer" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetail;
