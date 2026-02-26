import React, { useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import { Trash2, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/stores';

const formatINR = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const CartPage: React.FC = memo(() => {
  const { cart, isLoading, fetchCart, updateCartItem, removeFromCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton variant="text" height={48} width="25%" className="mb-6" />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} className="rounded-2xl mb-4" />
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} className="rounded-2xl" />
          </Grid>
        </Grid>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-200 dark:text-gray-700 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 text-white font-semibold rounded-2xl hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Shopping Cart <span className="text-gray-400 font-normal text-lg">({cart.items.length} items)</span>
      </h1>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex gap-4"
              >
                <Link to={`/products/${item.productId}`} className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=Shoe'; }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-semibold text-gray-900 dark:text-white line-clamp-1 hover:text-orange-600 transition-colors"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-0.5">Size: {item.variant?.size}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${item.product?.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.id, Math.min(10, item.quantity + 1))}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>GST (18%)</span>
                <span>{formatINR(tax)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-xs text-orange-700 dark:text-orange-300 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                Add {formatINR(999 - subtotal)} more for FREE shipping!
              </div>
            )}

            <Divider sx={{ my: 2 }} />
            <div className="flex justify-between font-bold text-gray-900 dark:text-white mb-6">
              <span>Total</span>
              <span className="text-lg">{formatINR(total)}</span>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) navigate('/login', { state: { from: { pathname: '/checkout' } } });
                else navigate('/checkout');
              }}
              className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-colors"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </Grid>
      </Grid>
    </div>
  );
});
CartPage.displayName = 'CartPage';

export default CartPage;
