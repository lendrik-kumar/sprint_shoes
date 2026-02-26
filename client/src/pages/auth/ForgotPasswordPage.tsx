import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { apiClient } from '@/api/client';

const emailSchema = z.object({ email: z.string().email('Invalid email address') });
type EmailForm = z.infer<typeof emailSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailForm) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await apiClient.post('/auth/password-reset/initiate', { email: data.email });
      setSent(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">StepStyle</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-gray-500 mt-1">
            {sent
              ? 'Check your inbox for the reset link'
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Email sent!</h2>
              <p className="text-gray-500 text-sm">
                We sent a password reset link to{' '}
                <span className="font-medium text-orange-600">{getValues('email')}</span>
              </p>
              <p className="text-gray-500 text-sm mt-4">
                Didn't receive it?{' '}
                <button onClick={() => setSent(false)} className="text-orange-600 font-medium">
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <>
              {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {serverError}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition disabled:opacity-60"
                >
                  {isLoading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link to="/login" className="text-orange-600 font-medium hover:text-orange-700">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
