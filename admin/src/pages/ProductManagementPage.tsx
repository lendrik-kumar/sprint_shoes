import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductAdminStore } from '@/stores';
import type { Product } from '@/types';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  basePrice: z.coerce.number().positive('Price must be positive'),
  discountPrice: z.coerce.number().optional(),
  image: z.string().url('Must be a valid URL'),
  inStock: z.boolean().optional(),
});
type ProductFormData = z.infer<typeof productSchema>;

const formatINR = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const ProductManagementPage: React.FC = memo(() => {
  const { products, isLoading, fetchProducts, createProduct, updateProduct, deleteProduct } =
    useProductAdminStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    fetchProducts(1, 25);
  }, [fetchProducts]);

  const openCreate = useCallback(() => {
    setEditingProduct(null);
    reset({});
    setDialogOpen(true);
  }, [reset]);

  const openEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      discountPrice: product.discountPrice,
      image: product.image,
      inStock: product.inStock,
    });
    setDialogOpen(true);
  }, [reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data);
    }
    setDialogOpen(false);
    reset({});
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteProduct(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const columns: GridColDef<Product>[] = [
    {
      field: 'image',
      headerName: '',
      width: 64,
      sortable: false,
      renderCell: ({ row }) => (
        <img src={row.image} alt={row.name} className="w-10 h-10 rounded-lg object-cover" />
      ),
    },
    { field: 'name', headerName: 'Product Name', flex: 1.5, minWidth: 180 },
    {
      field: 'category',
      headerName: 'Category',
      width: 130,
      valueGetter: ({ row }: { row: Product }) => row.category?.name ?? '—',
    },
    {
      field: 'basePrice',
      headerName: 'Price',
      width: 110,
      valueFormatter: ({ value }: { value: number }) => formatINR(value),
    },
    {
      field: 'discountPrice',
      headerName: 'Sale Price',
      width: 120,
      valueFormatter: ({ value }: { value: number | undefined }) => (value ? formatINR(value) : '—'),
    },
    {
      field: 'inStock',
      headerName: 'Stock',
      width: 100,
      renderCell: (params: GridRenderCellParams<Product, boolean>) => (
        <Chip label={params.value ? 'In Stock' : 'Out of Stock'} color={params.value ? 'success' : 'error'} size="small" />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openEdit(params.row)}>
              <Pencil size={15} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteConfirmId(params.row.id)}>
              <Trash2 size={15} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Product Management</Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={() => fetchProducts(1, 25)} size="small">
              <RefreshCw size={18} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={openCreate}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={isLoading}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          pageSizeOptions={[10, 25, 50]}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            '& .MuiDataGrid-cell': { alignItems: 'center', display: 'flex' },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
            {[
              { name: 'name', label: 'Product Name', placeholder: 'e.g. Nike Air Max 90' },
              { name: 'image', label: 'Image URL', placeholder: 'https://…' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  {...register(name as keyof ProductFormData)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors[name as keyof ProductFormData] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[name as keyof ProductFormData]?.message as string}
                  </p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
                <input
                  {...register('basePrice')}
                  type="number"
                  min={0}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.basePrice && <p className="mt-1 text-xs text-red-600">{errors.basePrice.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
                <input
                  {...register('discountPrice')}
                  type="number"
                  min={0}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('inStock')} type="checkbox" className="rounded" />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" variant="contained" sx={{ borderRadius: 2, textTransform: 'none' }}>
            {editingProduct ? 'Save Changes' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The product will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirmId(null)} sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
ProductManagementPage.displayName = 'ProductManagementPage';

export default ProductManagementPage;
