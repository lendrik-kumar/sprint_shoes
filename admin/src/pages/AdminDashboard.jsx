import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Users, Package, ShoppingCart, TrendingUp, LogOut, Plus, Pencil, Trash2, Eye, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

// ─── API helper ─────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('accessToken');
}

async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...opts.headers,
    },
    ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `API error ${res.status}`);
  return json;
}

// ─── Shared tiny UI primitives ──────────────────────────────────────────────
function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center py-20 ${className}`}>
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Badge({ children, color = 'gray' }) {
  const colors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

// ─── Main Layout ────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { logout } = useAuthStore();

  const NavButton = ({ tab, label, icon: Icon }) => (
    <button
      onClick={() => setCurrentTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentTab === tab ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="text-sm text-gray-600 mt-1">Management Panel</p>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <NavButton tab="dashboard" label="Dashboard" icon={BarChart3} />
          <NavButton tab="users" label="Users" icon={Users} />
          <NavButton tab="products" label="Products" icon={Package} />
          <NavButton tab="orders" label="Orders" icon={ShoppingCart} />
          <NavButton tab="analytics" label="Analytics" icon={TrendingUp} />
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {currentTab === 'dashboard' && <DashboardTab />}
        {currentTab === 'users' && <UserManagementTab />}
        {currentTab === 'products' && <ProductManagementTab />}
        {currentTab === 'orders' && <OrderManagementTab />}
        {currentTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Dashboard Tab – real stats from /admin/stats
// ═══════════════════════════════════════════════════════════════════════════
function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api('/admin/stats')
      .then((json) => setStats(json.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="p-8 text-red-600">Error loading dashboard: {error}</div>;
  if (!stats) return null;

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} title="Total Users" value={stats.totalUsers} />
        <StatCard icon={ShoppingCart} title="Total Orders" value={stats.totalOrders} />
        <StatCard
          icon={TrendingUp}
          title="Total Revenue"
          value={stats.totalRevenue > 0 ? `₹${(stats.totalRevenue / 100).toLocaleString('en-IN')}` : '₹0'}
        />
        <StatCard icon={Package} title="Pending Orders" value={stats.pendingOrders} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h2>
          {stats.revenueOverTime && stats.revenueOverTime.length > 0 ? (
            <div className="space-y-2">
              {stats.revenueOverTime.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">{item.month || item.date}</span>
                  <span className="font-semibold">₹{(item.revenue / 100).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No revenue data yet — orders will appear here
            </div>
          )}
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sales by Category</h2>
          {stats.salesByCategory && stats.salesByCategory.length > 0 ? (
            <div className="space-y-4">
              {stats.salesByCategory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.category}</span>
                  <div className="text-right">
                    <span className="font-bold">{item.count} orders</span>
                    <span className="text-gray-500 text-sm ml-2">
                      ₹{(item.revenue / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No sales data yet — orders will appear here
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      {stats.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-2">Order #</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="text-sm">
                  <td className="py-2 font-medium">{o.orderNumber}</td>
                  <td className="py-2 text-gray-600">{o.customer || '—'}</td>
                  <td className="py-2 font-semibold">₹{(o.amount / 100).toLocaleString('en-IN')}</td>
                  <td className="py-2">
                    <Badge color={o.status === 'DELIVERED' ? 'green' : o.status === 'CANCELLED' ? 'red' : 'blue'}>
                      {o.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// User Management Tab
// ═══════════════════════════════════════════════════════════════════════════
function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const json = await api(`/admin/users?limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}`);
      setUsers(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleActive = async (user) => {
    const action = user.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${user.email}?`)) return;
    try {
      await api(`/admin/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      fetchUsers();
    } catch (e) {
      alert(`Failed to ${action} user: ${e.message}`);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <input
          className="w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No users found</td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.firstName} {user.lastName || ''}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge color={user.role === 'ADMIN' ? 'purple' : 'gray'}>{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge color={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`font-medium ${user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Product Management Tab — FULL CRUD
// ═══════════════════════════════════════════════════════════════════════════
const EMPTY_FORM = {
  name: '',
  description: '',
  basePrice: '',
  discountPrice: '',
  discountPercent: '',
  categoryId: '',
  sku: '',
  image: '',
};

function ProductManagementTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Fetch products from real API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const json = await api('/admin/products?limit=100');
      setProducts(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories for the dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const json = await api('/products/filters/meta');
      setCategories(json.data?.categories || []);
    } catch {
      // fallback – not critical
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Open the modal in create mode
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  // Open the modal in edit mode, pre-fill the form
  const openEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      basePrice: String(product.basePrice || ''),
      discountPrice: String(product.discountPrice || ''),
      discountPercent: String(product.discountPercent || ''),
      categoryId: product.categoryId || '',
      sku: product.sku || '',
      image: product.images?.[0]?.url || '',
    });
    setShowModal(true);
  };

  // Save (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        discountPrice: formData.discountPrice || null,
        discountPercent: formData.discountPercent || null,
        categoryId: formData.categoryId,
        sku: formData.sku,
        image: formData.image || null,
      };

      if (editingId) {
        await api(`/admin/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await api('/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setShowModal(false);
      setFormData(EMPTY_FORM);
      setEditingId(null);
      fetchProducts();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await api(`/admin/products/${product.id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  };

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex justify-between items-center">
          {error}
          <button onClick={() => setError(null)} className="text-red-500 font-bold">✕</button>
        </div>
      )}

      {/* ── Product Modal ────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price *</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.basePrice}
                    onChange={(e) => updateField('basePrice', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.discountPrice}
                    onChange={(e) => updateField('discountPrice', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.discountPercent}
                    onChange={(e) => updateField('discountPercent', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.sku}
                    onChange={(e) => updateField('sku', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={formData.categoryId}
                    onChange={(e) => updateField('categoryId', e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="/assets/shoes/shoe-5.avif"
                  value={formData.image}
                  onChange={(e) => updateField('image', e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Products Table ────────────────────────────────────────── */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products yet. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <img
                      src={product.images?.[0]?.url || '/assets/shoes/shoe-5.avif'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      {product.discountPrice ? (
                        <>
                          <span className="font-semibold">₹{product.discountPrice}</span>
                          <span className="text-gray-400 line-through ml-2 text-xs">₹{product.basePrice}</span>
                        </>
                      ) : (
                        <span className="font-semibold">₹{product.basePrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{product.category?.name || '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge color={product.isActive ? 'green' : 'red'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Order Management Tab
// ═══════════════════════════════════════════════════════════════════════════
function OrderManagementTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const json = await api('/admin/orders?limit=50');
      setOrders(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const statusColors = {
    PENDING: 'yellow',
    PROCESSING: 'blue',
    SHIPPED: 'purple',
    DELIVERED: 'green',
    CANCELLED: 'red',
  };

  const handleUpdateStatus = async (order, newStatus) => {
    try {
      await api(`/admin/orders/${order.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (e) {
      alert(`Failed to update status: ${e.message}`);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      {loading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          No orders yet. Orders placed by customers will appear here.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.user?.email || '—'}</td>
                  <td className="px-6 py-4 text-sm font-semibold">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge color={statusColors[order.status] || 'gray'}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Analytics Tab – real aggregated data
// ═══════════════════════════════════════════════════════════════════════════
function AnalyticsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/admin/stats')
      .then((json) => setStats(json.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <p className="text-gray-600 text-sm">Total Products</p>
          <p className="text-3xl font-bold mt-2">{stats?.totalProducts ?? 0}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-3xl font-bold mt-2">{stats?.totalUsers ?? 0}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-3xl font-bold mt-2">{stats?.totalOrders ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sales by Category</h2>
          {stats?.salesByCategory?.length > 0 ? (
            <div className="space-y-3">
              {stats.salesByCategory.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.category}</span>
                  <span className="font-bold">{item.count} orders</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 py-8 text-center">No sales data yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Revenue</span>
              <span className="font-bold">
                ₹{stats?.totalRevenue ? (stats.totalRevenue / 100).toLocaleString('en-IN') : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Orders</span>
              <span className="font-bold">{stats?.totalOrders ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Avg Order Value</span>
              <span className="font-bold">
                ₹{stats?.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders / 100).toLocaleString('en-IN') : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
