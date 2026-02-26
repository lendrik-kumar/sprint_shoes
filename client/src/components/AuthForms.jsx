import React, { useState } from 'react';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { Button, Input, Alert, Divider } from './UI';
import { useAuthStore } from '../stores/authStore';

export function LoginForm() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    await login(email, password);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      {(error || formError) && (
        <Alert type="error" message={error || formError} onClose={clearError} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <Lock className="absolute left-3 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button type="submit" fullWidth loading={isLoading} disabled={isLoading}>
          Sign In
        </Button>
      </form>

      <Divider text="or" />

      <div className="text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <a href="#/register" className="font-semibold text-black hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    await register(formData.email, formData.password, formData.firstName, formData.lastName);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">Join us and start shopping</p>
      </div>

      {(error || formError) && (
        <Alert type="error" message={error || formError} onClose={clearError} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="First Name"
            placeholder="John"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            type="text"
            label="Last Name"
            placeholder="Doe"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <Input
          type="email"
          label="Email"
          placeholder="your@email.com"
          name="email"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <Lock className="absolute left-3 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="••••••••"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={Lock}
          required
        />

        <Button type="submit" fullWidth loading={isLoading} disabled={isLoading}>
          Create Account
        </Button>
      </form>

      <Divider text="or" />

      <div className="text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <a href="#/login" className="font-semibold text-black hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
