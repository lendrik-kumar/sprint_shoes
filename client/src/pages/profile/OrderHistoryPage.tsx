import React, { useEffect, memo } from 'react';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Eye, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '@/stores';
import type { OrderStatus } from '@/types';

const formatINR = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const STATUS_COLOR: Record<OrderStatus, 'default' | 'info' | 'warning' | 'success' | 'error' | 'primary'> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'error',
  RETURNED: 'default',
};

const OrderHistoryPage: React.FC = memo(() => {
  const { orders, isLoading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders(1, 50);
  }, [fetchOrders]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-orange-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={64} className="rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Your orders will appear here</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <span className="font-mono text-sm font-semibold text-orange-600">
                      {order.orderNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{formatINR(order.total)}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={STATUS_COLOR[order.status]}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View details">
                      <IconButton size="small" aria-label="View order">
                        <Eye className="w-4 h-4" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
});
OrderHistoryPage.displayName = 'OrderHistoryPage';

export default OrderHistoryPage;
