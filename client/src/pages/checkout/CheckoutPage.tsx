import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Grid from '@mui/material/Grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import FormControl from '@mui/material/FormControl';

import Divider from '@mui/material/Divider';
import { CreditCard, Smartphone, Banknote, ChevronRight, ChevronLeft } from 'lucide-react';
import { useCartStore, useOrderStore, useAuthStore } from '@/stores';

const addressSchema = z.object({
  street: z.string().min(5, 'Please enter your full street address'),
  city: z.string().min(2, 'Enter city name'),
  state: z.string().min(2, 'Enter state name'),
  zip: z.string().regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit PIN code'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});

type AddressForm = z.infer<typeof addressSchema>;

const STEPS = ['Delivery Address', 'Payment', 'Review'];

const formatINR = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const CheckoutPage: React.FC = memo(() => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();
  const { user } = useAuthStore();

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [orderAddress, setOrderAddress] = useState<AddressForm | null>(null);

  const subtotal = cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      phone: user?.phone ?? '',
    },
  });

  const handleAddressSubmit = (data: AddressForm) => {
    setOrderAddress(data);
    setActiveStep(1);
  };

  const handlePlaceOrder = async () => {
    if (!orderAddress || !cart) return;
    try {
      const order = await createOrder({
        shippingAddress: orderAddress,
        paymentMethod,
      });
      navigate(`/checkout/success?orderId=${order.id}`);
    } catch {
      // error handled by store
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={7}>
          {/* Step 0: Address */}
          {activeStep === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5">Delivery Address</h2>
              <form onSubmit={handleSubmit(handleAddressSubmit)} noValidate className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Street Address
                  </label>
                  <input
                    {...register('street')}
                    placeholder="House No, Building, Street, Area"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.street && <p className="mt-1 text-xs text-red-600">{errors.street.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                    <input
                      {...register('city')}
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State</label>
                    <input
                      {...register('state')}
                      placeholder="Maharashtra"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">PIN Code</label>
                    <input
                      {...register('zip')}
                      placeholder="400001"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.zip && <p className="mt-1 text-xs text-red-600">{errors.zip.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile Number</label>
                    <input
                      {...register('phone')}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Payment <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Step 1: Payment */}
          {activeStep === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5">Payment Method</h2>
              <FormControl component="fieldset" className="w-full">
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'UPI' | 'CARD' | 'COD')}>
                  {[
                    { value: 'UPI', label: 'UPI / Net Banking', icon: Smartphone, sub: 'GPay, PhonePe, Paytm, BHIM' },
                    { value: 'CARD', label: 'Credit / Debit Card', icon: CreditCard, sub: 'Visa, Mastercard, RuPay' },
                    { value: 'COD', label: 'Cash on Delivery', icon: Banknote, sub: 'Pay when you receive' },
                  ].map(({ value, label, icon: Icon, sub }) => (
                    <div
                      key={value}
                      onClick={() => setPaymentMethod(value as 'UPI' | 'CARD' | 'COD')}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl mb-3 cursor-pointer transition-all ${
                        paymentMethod === value
                          ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'
                      }`}
                    >
                      <Radio value={value} sx={{ color: paymentMethod === value ? '#ea580c' : undefined }} />
                      <Icon className={`w-5 h-5 ${paymentMethod === value ? 'text-orange-600' : 'text-gray-500'}`} />
                      <div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{label}</div>
                        <div className="text-xs text-gray-500">{sub}</div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>

              {/* Mock card form */}
              {paymentMethod === 'CARD' && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-3">
                  <p className="text-xs text-gray-500 font-medium">This is a mock payment — no real transactions occur</p>
                  <input placeholder="Card number" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" readOnly value="4111 1111 1111 1111" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM/YY" className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" readOnly value="12/28" />
                    <input placeholder="CVV" className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" readOnly value="123" />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setActiveStep(0)}
                  className="flex items-center gap-1 px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setActiveStep(2)}
                  className="flex-1 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  Review Order <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {activeStep === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5">Review Order</h2>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Delivering to</h3>
                {orderAddress && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {orderAddress.street}, {orderAddress.city}, {orderAddress.state} — {orderAddress.zip}<br />
                    📞 +91 {orderAddress.phone}
                  </p>
                )}
              </div>

              <Divider sx={{ my: 3 }} />

              <div className="space-y-3 mb-4">
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.variant?.size} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setActiveStep(1)}
                  className="flex items-center gap-1 px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    `Place Order — ${formatINR(total)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </Grid>

        {/* Right Column: Summary */}
        <Grid item xs={12} md={5}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({cart?.items?.length} items)</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>GST (18%)</span>
                <span>{formatINR(tax)}</span>
              </div>
            </div>
            <Divider sx={{ my: 2 }} />
            <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base">
              <span>Total Amount</span>
              <span>{formatINR(total)}</span>
            </div>
            {shipping === 0 && (
              <p className="text-xs text-green-600 mt-2">🎉 You're saving {formatINR(99)} on delivery!</p>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
});
CheckoutPage.displayName = 'CheckoutPage';

export default CheckoutPage;
