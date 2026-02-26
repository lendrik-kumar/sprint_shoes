import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  DataGrid,
  type GridColDef,
  GridToolbar,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { Eye, RefreshCw } from 'lucide-react';
import { useOrderAdminStore } from '@/stores';
import type { Order, OrderStatus } from '@/types';

const formatINR = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED',
];

const STATUS_COLOR: Record<OrderStatus, 'default' | 'info' | 'warning' | 'success' | 'error' | 'primary'> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'error',
  RETURNED: 'default',
};

const OrderManagementPage: React.FC = memo(() => {
  const { orders, isLoading, fetchOrders, getOrderById, selectedOrder, updateOrderStatus, clearSelectedOrder } =
    useOrderAdminStore();

  const [detailOpen, setDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    fetchOrders(1, 50, filterStatus || undefined);
  }, [fetchOrders, filterStatus]);

  const handleViewOrder = useCallback(async (id: string) => {
    await getOrderById(id);
    setDetailOpen(true);
  }, [getOrderById]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    await updateOrderStatus(id, status);
  };

  const columns: GridColDef<Order>[] = [
    {
      field: 'orderNumber',
      headerName: 'Order #',
      width: 140,
      renderCell: ({ value }) => (
        <span className="font-mono text-sm font-semibold text-indigo-600">{value}</span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 130,
      valueFormatter: ({ value }: { value: string }) =>
        new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      valueFormatter: ({ value }: { value: number }) => formatINR(value),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: ({ row }) => (
        <Select
          value={row.status}
          onChange={(e: SelectChangeEvent<OrderStatus>) => handleStatusChange(row.id, e.target.value as OrderStatus)}
          size="small"
          sx={{ fontSize: '0.8rem', minWidth: 150 }}
          onClick={(e) => e.stopPropagation()}
        >
          {ORDER_STATUSES.map((s) => (
            <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem' }}>{s}</MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'payment',
      headerName: 'Payment',
      width: 120,
      renderCell: ({ row }) => (
        <Chip
          label={row.payment?.status ?? 'N/A'}
          size="small"
          color={row.payment?.status === 'COMPLETED' ? 'success' : 'default'}
          sx={{ fontSize: '0.7rem' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: ({ row }) => (
        <Tooltip title="View details">
          <IconButton size="small" onClick={() => handleViewOrder(row.id)}>
            <Eye size={15} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Order Management</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter Status"
              onChange={(e: SelectChangeEvent<string>) => setFilterStatus(e.target.value as OrderStatus | '')}
            >
              <MenuItem value="">All</MenuItem>
              {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton onClick={() => fetchOrders(1, 50)} size="small">
              <RefreshCw size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ height: 580, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          loading={isLoading}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          pageSizeOptions={[10, 25, 50]}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Order Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => { setDetailOpen(false); clearSelectedOrder(); }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Order #{selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box className="space-y-4">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <div className="mt-1">
                    <Chip label={selectedOrder.status} color={STATUS_COLOR[selectedOrder.status]} size="small" />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Payment</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedOrder.payment?.status ?? 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body2">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                  <Typography variant="body2" fontWeight={700}>{formatINR(selectedOrder.total)}</Typography>
                </Grid>
              </Grid>
              <Divider />
              <div>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Items</Typography>
                {selectedOrder.items.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                    <Typography variant="body2">{item.product?.name ?? 'Product'} × {item.quantity}</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatINR(item.price * item.quantity)}</Typography>
                  </Box>
                ))}
              </div>
              <Divider />
              <div>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Shipping Address
                </Typography>
                <Typography variant="body2">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},{' '}
                  {selectedOrder.shippingAddress.state} — {selectedOrder.shippingAddress.zip}
                </Typography>
                <Typography variant="body2" color="text.secondary">📞 +91 {selectedOrder.shippingAddress.phone}</Typography>
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setDetailOpen(false); clearSelectedOrder(); }} sx={{ borderRadius: 2, textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
OrderManagementPage.displayName = 'OrderManagementPage';

export default OrderManagementPage;
