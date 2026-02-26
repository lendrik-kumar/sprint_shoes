import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Package, ShoppingCart, TrendingUp, LogOut } from 'lucide-react';
import { Button, Spinner, Alert, Modal, Input, Select, Textarea } from '../components/UI';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // const response = await fetch('/api/admin/stats');
      // const data = await response.json();
      // setStats(data);
      setStats({
        totalUsers: 1250,
        totalOrders: 3420,
        totalRevenue: 5420000,
        todayRevenue: 125000,
        activeUsers: 432,
        pendingOrders: 28,
      });
    } catch (err) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Logout logic
    window.location.hash = '/';
  };

  const NavButton = ({ tab, label, icon: Icon }) => (
    <button
      onClick={() => setCurrentTab(tab)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${currentTab === tab ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}
      `}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="text-sm text-gray-600 mt-1">Management Panel</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavButton tab="dashboard" label="Dashboard" icon={BarChart3} />
          <NavButton tab="users" label="Users" icon={Users} />
          <NavButton tab="products" label="Products" icon={Package} />
          <NavButton tab="orders" label="Orders" icon={ShoppingCart} />
          <NavButton tab="analytics" label="Analytics" icon={TrendingUp} />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <Button
            fullWidth
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="justify-center"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {currentTab === 'dashboard' && <AdminDashboardContent stats={stats} loading={loading} />}
        {currentTab === 'users' && <UserManagementTab />}
        {currentTab === 'products' && <ProductManagementTab />}
        {currentTab === 'orders' && <OrderManagementTab />}
        {currentTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
}

function AdminDashboardContent({ stats, loading }) {
  if (loading) return <Spinner size="lg" className="mt-20" />;

  const StatCard = ({ icon: Icon, title, value, trend }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && <p className="text-sm text-green-600 mt-2">↑ {trend} from last month</p>}
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} title="Total Users" value={stats.totalUsers} />
        <StatCard icon={ShoppingCart} title="Total Orders" value={stats.totalOrders} />
        <StatCard
          icon={TrendingUp}
          title="Total Revenue"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
        />
        <StatCard icon={Package} title="Pending Orders" value={stats.pendingOrders} />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-4">
            {[
              { status: 'Delivered', count: 2840, color: 'bg-green-100 text-green-800' },
              { status: 'Processing', count: 340, color: 'bg-blue-100 text-blue-800' },
              { status: 'Pending', count: 240, color: 'bg-yellow-100 text-yellow-800' },
              { status: 'Cancelled', count: 0, color: 'bg-red-100 text-red-800' },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.color}`}>
                  {item.status}
                </span>
                <span className="font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();
      // setUsers(data);
      setUsers([
        {
          id: '1',
          email: 'user1@example.com',
          firstName: 'John',
          role: 'USER',
          isActive: true,
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          email: 'user2@example.com',
          firstName: 'Jane',
          role: 'USER',
          isActive: true,
          createdAt: '2024-01-20',
        },
      ]);
    } catch (err) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        // await fetch(`/api/admin/users/${userId}/deactivate`, { method: 'POST' });
        fetchUsers();
      } catch (err) {
        // Handle error silently in production
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="w-64">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Spinner size="lg" />
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.firstName}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeactivateUser(user.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Deactivate
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

function ProductManagementTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    discountPrice: '',
    category: '',
    sku: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // const response = await fetch('/api/admin/products');
      // const data = await response.json();
      // setProducts(data);
      setProducts([
        {
          id: '1',
          name: 'Running Shoes',
          basePrice: 5999,
          discountPrice: 4999,
          category: 'Sports',
          sku: 'RS001',
        },
        {
          id: '2',
          name: 'Casual Shoes',
          basePrice: 3999,
          discountPrice: 2999,
          category: 'Casual',
          sku: 'CS001',
        },
      ]);
    } catch (err) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // const response = await fetch('/api/admin/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const newProduct = await response.json();
      // setProducts([...products, newProduct]);
      setFormData({
        name: '',
        description: '',
        basePrice: '',
        discountPrice: '',
        category: '',
        sku: '',
      });
      setShowModal(false);
    } catch (err) {
      // Handle error silently in production
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <Button onClick={() => setShowModal(true)}>+ Add Product</Button>
      </div>

      <Modal
        isOpen={showModal}
        title="Add New Product"
        onClose={() => setShowModal(false)}
        size="lg"
        actions={[
          { label: 'Cancel', variant: 'secondary', onClick: () => setShowModal(false) },
          { label: 'Add Product', onClick: handleAddProduct },
        ]}
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input
            label="Product Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Base Price"
              type="number"
              required
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            />
            <Input
              label="Discount Price"
              type="number"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
            />
          </div>
          <Input
            label="SKU"
            required
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: '', label: 'Select Category' },
              { value: 'Sports', label: 'Sports' },
              { value: 'Casual', label: 'Casual' },
              { value: 'Formal', label: 'Formal' },
            ]}
          />
        </form>
      </Modal>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm">
                    ₹{product.discountPrice || product.basePrice}
                  </td>
                  <td className="px-6 py-4 text-sm">{product.category}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
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

function OrderManagementTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // const response = await fetch('/api/admin/orders');
      // const data = await response.json();
      // setOrders(data);
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-001',
          userEmail: 'user@example.com',
          status: 'PROCESSING',
          totalAmount: 9999,
          createdAt: '2024-01-20',
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          userEmail: 'user2@example.com',
          status: 'SHIPPED',
          totalAmount: 14999,
          createdAt: '2024-01-21',
        },
      ]);
    } catch (err) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>

      {loading ? (
        <Spinner size="lg" />
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
                  <td className="px-6 py-4 text-sm text-gray-600">{order.userEmail}</td>
                  <td className="px-6 py-4 text-sm font-semibold">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                    <button className="text-orange-600 hover:text-orange-800">Update</button>
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

function AnalyticsTab() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-3">
            {[
              { name: 'Running Shoes', sales: 340 },
              { name: 'Casual Shoes', sales: 280 },
              { name: 'Sports Shoes', sales: 190 },
            ].map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <span className="text-gray-700">{item.name}</span>
                <span className="font-bold">{item.sales} sales</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Breakdown</h2>
          <div className="space-y-3">
            {[
              { category: 'Online Sales', amount: '₹15,40,000' },
              { category: 'Returns', amount: '-₹1,20,000' },
              { category: 'Discounts', amount: '-₹2,80,000' },
            ].map((item) => (
              <div key={item.category} className="flex justify-between items-center">
                <span className="text-gray-700">{item.category}</span>
                <span className="font-bold">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
