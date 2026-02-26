import React, { useEffect, useState, memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardAdminStore } from '@/stores';

const COLORS = ['#4f46e5', '#0891b2', '#16a34a', '#ea580c', '#dc2626', '#7c3aed'];

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const AnalyticsPage: React.FC = memo(() => {
  const { stats, isLoading, fetchStats } = useDashboardAdminStore();
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchStats();
  }, [fetchStats, period]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Analytics</Typography>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={(e: SelectChangeEvent) => setPeriod(e.target.value)}>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Revenue trend */}
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Revenue Trend</Typography>
              {!isLoading && stats?.revenueOverTime && (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={stats.revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => [formatINR(v), 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sales by Category Pie */}
        <Grid item xs={12} lg={4}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Sales by Category</Typography>
              {!isLoading && stats?.salesByCategory && (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stats.salesByCategory}
                      dataKey="sales"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ category, percent }) =>
                        `${category} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {stats.salesByCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [v.toLocaleString('en-IN'), 'Units']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Orders bar chart */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Orders Over Time</Typography>
              {!isLoading && stats?.revenueOverTime && (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});
AnalyticsPage.displayName = 'AnalyticsPage';

export default AnalyticsPage;
