import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../../store/cartStore';

const checkoutSchema = z.object({
  addressId: z.string().uuid('Invalid address ID'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const CheckoutPage = () => {
  const { items, clearLocalCart } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (_data: CheckoutFormValues) => {
    // In a real app this would call api.post('/orders/checkout') using data and the backend would clear the cart.
    clearLocalCart();
    alert('Order placed successfully (Mock)');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Address ID</label>
            <input
              {...register('addressId')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            />
            {errors.addressId && (
              <p className="text-red-500 text-xs mt-1">{errors.addressId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <input
              {...register('paymentMethod')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="credit_card"
            />
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Order Notes</label>
            <textarea
              {...register('notes')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Any special instructions?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700"
            disabled={items.length === 0}
          >
            Confirm Order
          </button>
        </form>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b">
              <span>Product ID: {item.productId.substring(0, 8)}...</span>
              <span>Qty: {item.quantity}</span>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500">Your cart is empty.</p>}
        </div>
      </div>
    </div>
  );
};
