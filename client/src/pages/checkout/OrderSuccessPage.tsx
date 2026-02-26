import React, { useEffect, memo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useOrderStore } from '@/stores';

const OrderSuccessPage: React.FC = memo(() => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { selectedOrder, getOrderById } = useOrderStore();

  useEffect(() => {
    if (orderId) getOrderById(orderId);
  }, [orderId, getOrderById]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-2">
          Thank you for your purchase. Your shoes are on their way!
        </p>
        {selectedOrder && (
          <p className="text-sm text-orange-600 font-medium mb-6">
            Order ID: <span className="font-mono">{selectedOrder.orderNumber}</span>
          </p>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" /> What happens next?
          </h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold mt-0.5">1.</span> We'll confirm your order
              via email & SMS
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold mt-0.5">2.</span> Your shoes will be packed
              and dispatched within 24 hours
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold mt-0.5">3.</span> Delivery within 3–5
              business days
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors"
          >
            Track Order <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
});
OrderSuccessPage.displayName = 'OrderSuccessPage';

export default OrderSuccessPage;
