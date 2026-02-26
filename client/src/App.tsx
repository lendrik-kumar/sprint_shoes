import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { CheckoutPage } from './pages/shop/CheckoutPage';
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Dummy homepage for now
const HomePage = () => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold">Shoe E-commerce</h1>
    <p className="mt-4">Welcome to our store!</p>
    <a href="/checkout" className="text-blue-500 hover:underline">Go to Checkout (Protected)</a>
  </div>
);

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    // Initial auth sync on client load
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<div>Profile Placeholder</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
