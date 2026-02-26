import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Truck, Banknote, RotateCcw } from 'lucide-react';

/**
 * Newsletter Component
 * Email subscription section for marketing with service highlights
 */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    // Simulate API call - replace with actual backend integration
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Integrate with backend newsletter API
      setStatus('success');
      setMessage('Thanks for subscribing! Check your inbox for a welcome surprise.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const services = [
    {
      icon: Truck,
      title: 'Free shipping',
      description: 'Free shipping for all orders.',
    },
    {
      icon: Banknote,
      title: 'Cash on delivery',
      description: 'Cash on delivery at Zero Cost.',
    },
    {
      icon: RotateCcw,
      title: 'Easy return',
      description: 'Free 7 day Return and Exchange.',
    },
  ];

  return (
    <section className="bg-white">
      {/* Service Highlights Bar */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <service.icon className="w-12 h-12 text-neutral-700 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{service.title}</h3>
                  <p className="text-sm text-neutral-500">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Stay in the Loop</h2>
          <p className="text-neutral-600 mb-6">
            Subscribe to our newsletter for exclusive offers and updates.
          </p>

          {/* Form */}
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 text-neutral-900 bg-white border rounded-lg placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all ${
                    status === 'error' ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Subscribing...
                  </span>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Error Message */}
          {status === 'error' && <p className="mt-3 text-sm text-red-500">{message}</p>}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
