import React, { useEffect, memo } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
} from 'lucide-react';
import { useDashboardAdminStore } from '@/stores';

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const positive = change >= 0;
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              {positive ? (
                <TrendingUp size={14} className="text-green-600" />
              ) : (
                <TrendingDown size={14} className="text-red-600" />
              )}
              <Typography
                variant="caption"
                sx={{ color: positive ? 'success.main' : 'error.main', fontWeight: 600 }}
              >
                {positive ? '+' : ''}{change}% vs last month
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: color,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.9,
            }}
          >
            {icon as any}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = memo(() => {
  const { stats, isLoading, fetchStats } = useDashboardAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading || !stats) {
    return (
      <Box>
        <Skeleton variant="text" height={40} width="30%" sx={{ mb: 3 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatINR(stats.totalRevenue),
      change: stats.revenueChange,
      icon: <DollarSign size={22} color="white" />,
      color: '#4f46e5',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString('en-IN'),
      change: stats.ordersChange,
      icon: <ShoppingBag size={22} color="white" />,
      color: '#0891b2',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString('en-IN'),
      change: stats.usersChange,
      icon: <Users size={22} color="white" />,
      color: '#16a34a',
    },
    {
      title: 'Products Listed',
      value: stats.totalProducts.toLocaleString('en-IN'),
      change: 0,
      icon: <Package size={22} color="white" />,
      color: '#ea580c',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} lg={3} key={card.title}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Revenue Chart */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
            Revenue Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats.revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [formatINR(v), 'Revenue']} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Recent Orders
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {stats.recentOrders.map((order) => (
                  <Box
                    key={order.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: 2,
                      '&:hover': { bgcolor: 'grey.50' },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        #{order.orderNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customer} · {new Date(order.date).toLocaleDateString('en-IN')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {formatINR(order.amount)}
                      </Typography>
                      <Chip
                        label={order.status}
                        size="small"
                        sx={{ fontSize: '0.65rem', fontWeight: 700 }}
                        color={
                          order.status === 'DELIVERED'
                            ? 'success'
                            : order.status === 'CANCELLED'
                            ? 'error'
                            : 'default'
                        }
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales by Category */}
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Sales by Category
              </Typography>
              {stats.salesByCategory.map((item) => {
                const total = stats.salesByCategory.reduce((s, c) => s + c.sales, 0);
                const pct = Math.round((item.sales / total) * 100);
                return (
                  <Box key={item.category} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={500}>{item.category}</Typography>
                      <Typography variant="caption" color="text.secondary">{pct}%</Typography>
                    </Box>
                    <Box sx={{ height: 6, bgcolor: 'grey.100', borderRadius: 3, overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: 'primary.main', borderRadius: 3 }} />
                    </Box>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});
DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
