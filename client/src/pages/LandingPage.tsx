import React, { useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { ArrowRight, Star, Shield, Truck, RotateCcw, ShoppingBag } from 'lucide-react';
import { useProductStore } from '@/stores';

const CATEGORIES = [
  { label: 'Sneakers', emoji: '👟', slug: 'sneakers' },
  { label: 'Kolhapuris', emoji: '🥿', slug: 'kolhapuris' },
  { label: 'Boots', emoji: '🥾', slug: 'boots' },
  { label: 'Formals', emoji: '👞', slug: 'formals' },
  { label: 'Heels', emoji: '👠', slug: 'heels' },
  { label: 'Sports', emoji: '🏃', slug: 'sports' },
];

const TRUST_BADGES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: Shield, title: 'Secure Payments', desc: 'Razorpay & UPI supported' },
  { icon: ShoppingBag, title: '100% Authentic', desc: 'Genuine branded products' },
];

const formatINR = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const LandingPage: React.FC = memo(() => {
  const { products: featuredProducts, isLoading, fetchProducts: fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAzLTQgMS0yIDEtNSAwLTZzLTMtMS01IDAtNCAyLTQgM2MtMiAwLTQgMS00IDMgMCAzIDMgNCA1IDQgMSAwIDMgMS00IDMtMyAwLTYtMi02LTQgMC0xIDEtMyAyLTQgMiAwIDMtMSA1LTFzMyAxIDQgMS0xIDItMiA0eiIvPjwvZz48L2c+PC9zdmc+')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
            <div>
              <Chip label="New Collection 2025" color="warning" size="small" sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Walk in Style,<br />
                <span className="text-yellow-300">Made for India</span>
              </h1>
              <p className="text-lg text-orange-100 mb-8 leading-relaxed max-w-lg">
                From the streets of Mumbai to the peaks of Himachal — discover footwear crafted for
                every Indian journey. Authenticity in every step.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-2xl hover:bg-orange-50 transition-all hover:scale-105 shadow-lg"
                >
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products?filter=sale"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  View Sale
                </Link>
              </div>
              <div className="mt-10 flex gap-8">
                {[
                  { value: '50K+', label: 'Happy Customers' },
                  { value: '200+', label: 'Styles Available' },
                  { value: '4.8★', label: 'Average Rating' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-orange-200 text-sm">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center text-[10rem]">
                👟
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 dark:bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Grid container spacing={3}>
            {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
              <Grid item xs={6} md={3} key={title}>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 p-4">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm md:text-left text-center">{title}</div>
                    <div className="text-gray-500 text-xs mt-0.5 md:text-left text-center">{desc}</div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-1">Find your perfect pair</p>
          </div>
          <Link
            to="/products"
            className="hidden md:flex items-center gap-1 text-orange-600 font-medium text-sm hover:text-orange-700"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map(({ label, emoji, slug }) => (
            <Link
              key={slug}
              to={`/products?category=${slug}`}
              className="group flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-orange-300 hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="text-3xl">{emoji}</div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Featured Products
              </h2>
              <p className="text-gray-500 mt-1">Handpicked just for you</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-orange-600 font-medium text-sm hover:text-orange-700"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Skeleton variant="rectangular" height={280} className="rounded-2xl" />
                    <Skeleton variant="text" className="mt-2" />
                    <Skeleton variant="text" width="60%" />
                  </Grid>
                ))
              : (featuredProducts).slice(0, 8).map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id}>
                    <Link to={`/products/${product.id}`} className="group block">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Shoe';
                            }}
                          />
                          {product.discount && product.discount > 0 && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                              -{product.discount}%
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="text-xs text-gray-400 mb-1">{product.category?.name}</div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">
                            {product.name}
                          </h3>
                          {product.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-500">
                                {product.rating} ({product.reviews})
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {formatINR(product.discountPrice || product.basePrice)}
                            </span>
                            {product.discountPrice && product.discountPrice < product.basePrice && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatINR(product.basePrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Grid>
                ))}
          </Grid>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-10 md:p-16 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Step into a New Season
          </h2>
          <p className="text-orange-100 max-w-xl mx-auto mb-8">
            Subscribe and get 15% off your first order, plus early access to new drops.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors"
            >
              Get 15% Off
            </button>
          </form>
        </div>
      </section>
    </div>
  );
});
LandingPage.displayName = 'LandingPage';

export default LandingPage;
