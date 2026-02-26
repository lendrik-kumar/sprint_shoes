import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert } from './UI';
import { LoginForm, RegisterForm } from '../components/AuthForms';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <LoginForm />
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <RegisterForm />
      </div>
    </div>
  );
}

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch cart items
    setLoading(false);
    // Mock data for now
  }, []);

  const handleCheckout = () => {
    window.location.hash = '/checkout';
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="col-span-8">
            {loading && <Spinner size="lg" className="justify-center" />}
            {error && <Alert type="error" message={error} />}
            {cartItems.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button onClick={() => (window.location.hash = '/products')}>
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="col-span-4 bg-gray-50 rounded-lg p-6 h-fit sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹0</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">₹{total}</span>
            </div>

            <Button fullWidth onClick={handleCheckout} disabled={cartItems.length === 0}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      // API call to place order
      // await orderService.createOrder(...)
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && <Alert type="error" message={error} />}

        {step === 1 && (
          <div className="bg-white rounded-lg p-8 space-y-6">
            <h2 className="text-xl font-bold">Shipping Address</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={address.street}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={address.zipCode}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={address.phone}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <Button fullWidth onClick={() => setStep(2)}>
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-lg p-8 space-y-6">
            <h2 className="text-xl font-bold">Payment Method</h2>
            <div className="space-y-3">
              {['CARD', 'UPI', 'NETBANKING'].map((method) => (
                <label
                  key={method}
                  className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-4 font-medium">{method}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" fullWidth onClick={() => setStep(1)}>
                Back
              </Button>
              <Button fullWidth onClick={handlePlaceOrder} loading={loading}>
                Place Order
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-lg p-8 text-center space-y-6">
            <div className="text-5xl">✓</div>
            <h2 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h2>
            <p className="text-gray-600">Your order has been confirmed and will be shipped soon.</p>
            <Button onClick={() => (window.location.hash = '/orders')}>View Orders</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Fetch user profile
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-black text-white font-medium">
              Personal Info
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
              Addresses
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
              Orders
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
              Wishlist
            </button>
          </div>

          {/* Content */}
          <div className="col-span-2 bg-white rounded-lg p-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  disabled
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <Button onClick={() => setEditing(!editing)}>
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {loading && <Spinner size="lg" />}
        {orders.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 mb-4">No orders yet</p>
            <Button onClick={() => (window.location.hash = '/products')}>Continue Shopping</Button>
          </div>
        )}

        <div className="space-y-4">{/* Map orders here */}</div>
      </div>
    </div>
  );
}
