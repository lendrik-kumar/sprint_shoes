import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { AdminRoute } from './components/guards/AdminRoute';
import { useEffect } from 'react';
import { useAdminAuthStore } from './store/adminAuthStore';

// Dummy dashboard
const DashboardPage = () => {
  const logout = useAdminAuthStore(state => state.logout);
  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <button onClick={() => logout()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border-l-4 border-blue-500">
          <h3 className="text-slate-500 font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹4,52,000</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border-l-4 border-green-500">
          <h3 className="text-slate-500 font-medium">Active Orders</h3>
          <p className="text-3xl font-bold mt-2">32</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border-l-4 border-purple-500">
          <h3 className="text-slate-500 font-medium">Low Stock Items</h3>
          <p className="text-3xl font-bold mt-2 text-red-500">8</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const checkAuth = useAdminAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Admin Routes */}
        <Route path="/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<div>Products Placeholder</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
