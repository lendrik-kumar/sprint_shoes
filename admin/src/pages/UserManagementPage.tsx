import React, { useEffect, memo } from 'react';
import {
  DataGrid,
  type GridColDef,
  GridToolbar,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import { RefreshCw } from 'lucide-react';
import { useUserAdminStore } from '@/stores';
import type { User, UserRole } from '@/types';

const ROLES: UserRole[] = ['CUSTOMER', 'ADMIN', 'SUPERADMIN'];

const UserManagementPage: React.FC = memo(() => {
  const { users, isLoading, fetchUsers, updateUserRole, toggleUserStatus } = useUserAdminStore();

  useEffect(() => {
    fetchUsers(1, 50);
  }, [fetchUsers]);

  const columns: GridColDef<User>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 160,
      valueGetter: ({ row }: { row: User }) => `${row.firstName} ${row.lastName}`,
    },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
    {
      field: 'role',
      headerName: 'Role',
      width: 170,
      renderCell: ({ row }) => (
        <Select
          value={row.role}
          size="small"
          onChange={(e: SelectChangeEvent<UserRole>) => updateUserRole(row.id, e.target.value as UserRole)}
          sx={{ fontSize: '0.8rem', minWidth: 145 }}
          onClick={(e) => e.stopPropagation()}
        >
          {ROLES.map((r) => (
            <MenuItem key={r} value={r} sx={{ fontSize: '0.8rem' }}>{r}</MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 90,
      renderCell: ({ row }) => (
        <Tooltip title={row.isActive ? 'Deactivate account' : 'Activate account'}>
          <Switch
            checked={row.isActive}
            size="small"
            color="success"
            onChange={() => toggleUserStatus(row.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </Tooltip>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 130,
      valueFormatter: ({ value }: { value: string }) =>
        new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: ({ row }) => (
        <Chip
          label={row.isActive ? 'Active' : 'Inactive'}
          color={row.isActive ? 'success' : 'default'}
          size="small"
          sx={{ fontSize: '0.7rem' }}
        />
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>User Management</Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={() => fetchUsers(1, 50)} size="small">
            <RefreshCw size={18} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ height: 580, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={isLoading}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          pageSizeOptions={[10, 25, 50]}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
});
UserManagementPage.displayName = 'UserManagementPage';

export default UserManagementPage;
