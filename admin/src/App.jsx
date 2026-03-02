import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { AdminDashboard } from './pages/AdminDashboard';
import { Button, Input, Alert } from './components/UI';

const AdminLoginPage = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      // On success, the store sets isAuthenticated = true
      // and the App component automatically re-renders to show AdminDashboard
    } catch {
      // Error is already captured and set in the store by the login function
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Sign in to your admin account</p>
        </div>

        {error && <Alert severity="error" className="mb-6">{error.message}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-600 text-sm font-medium hover:text-gray-900"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <Button type="submit" fullWidth disabled={isLoading} className="mt-6">
            {isLoading ? 'Signing in...' : 'Sign in to Admin'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Demo Credentials:</strong>
            <br />
            Email: admin@example.com
            <br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { isAuthenticated, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return <AdminDashboard />;
};

export default App;
