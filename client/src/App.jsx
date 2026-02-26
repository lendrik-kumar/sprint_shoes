import { useEffect } from 'react';
import { RouterProvider, useRouter } from './hooks/useRouter.jsx';
import Navbar from './components/navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import {
  LoginPage,
  RegisterPage,
  CartPage,
  CheckoutPage,
  ProfilePage,
  OrdersPage,
} from './pages/CustomerPages.jsx';
import { useAuthStore } from './stores/index.js';

// Route component for handling different pages
const Routes = () => {
  const { currentPath } = useRouter();

  // Match routes
  if (currentPath === '/' || currentPath === '') {
    return <HomePage />;
  }

  if (currentPath === '/products') {
    return <ProductsPage />;
  }

  if (currentPath.startsWith('/product/')) {
    return <ProductPage />;
  }

  if (currentPath === '/login') {
    return <LoginPage />;
  }

  if (currentPath === '/register') {
    return <RegisterPage />;
  }

  if (currentPath === '/cart') {
    return <CartPage />;
  }

  if (currentPath === '/checkout') {
    return <CheckoutPage />;
  }

  if (currentPath === '/profile') {
    return <ProfilePage />;
  }

  if (currentPath === '/orders') {
    return <OrdersPage />;
  }

  // 404 Page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

const App = () => {
  const { init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <RouterProvider>
      <main className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes />
        </div>
        <Footer />
      </main>
    </RouterProvider>
  );
};

export default App;
