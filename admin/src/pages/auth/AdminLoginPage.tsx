import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminLoginFormValues = z.infer<typeof loginSchema>;

export const AdminLoginPage = () => {
  const { login } = useAdminAuthStore();
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    try {
      setErrorDetails('');
      // The store handles the API call enforcing auth cookies
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorDetails(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm p-8 bg-slate-800 text-white shadow-2xl rounded-xl">
        <h2 className="text-2xl font-bold mb-2 text-center text-blue-400">Admin Portal</h2>
        <p className="text-center text-slate-400 text-sm mb-6">Restricted Access</p>

        {errorDetails && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded text-sm">
            {errorDetails}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Work Email</label>
            <input
              {...register('email')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
