import React, { useState } from 'react';
import { X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle OTP request logic here
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-8 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Logo" className="h-12 w-auto invert" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-black mb-2">Log in to your account</h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Get personalised picks & faster checkout
        </p>

        {/* Phone Input */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Get OTP Button */}
          <button
            type="submit"
            disabled={phone.length !== 10}
            className={`w-full py-4 rounded-full font-semibold text-black transition ${
              phone.length === 10
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Get OTP
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By entering this site, you agree to the{' '}
          <a href="/terms" className="underline font-medium text-black">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline font-medium text-black">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
