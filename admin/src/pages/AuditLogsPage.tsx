import React, { useEffect, useState, memo } from 'react';
import {
  DataGrid,
  type GridColDef,
  GridToolbar,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import { RefreshCw, Search } from 'lucide-react';
import { useAuditAdminStore } from '@/stores';
import type { AuditLog } from '@/stores/auditAdminStore';

const AuditLogsPage: React.FC = memo(() => {
  const { auditLogs, isLoading, fetchAuditLogs, setFilters } = useAuditAdminStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAuditLogs(1, 50);
  }, [fetchAuditLogs]);

  const handleSearch = () => {
    setFilters({ search });
    fetchAuditLogs(1, 50, { search });
  };

  const columns: GridColDef<AuditLog>[] = [
    {
      field: 'createdAt',
      headerName: 'Time',
      width: 170,
      valueFormatter: ({ value }: { value: string }) =>
        new Date(value).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    { field: 'adminEmail', headerName: 'Admin', flex: 1, minWidth: 180 },
    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      renderCell: ({ value }) => (
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            value === 'DELETE'
              ? 'bg-red-100 text-red-700'
              : value === 'CREATE'
              ? 'bg-green-100 text-green-700'
              : value === 'UPDATE'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    { field: 'resource', headerName: 'Resource', width: 130 },
    { field: 'resourceId', headerName: 'Resource ID', flex: 1, minWidth: 160 },
    {
      field: 'details',
      headerName: 'Details',
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ value }) => (
        <span className="text-xs text-gray-500 truncate">{value ?? '—'}</span>
      ),
    },
    { field: 'ipAddress', headerName: 'IP', width: 130 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Audit Logs</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search logs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: <Search size={14} className="mr-1 text-gray-400" />,
              sx: { borderRadius: 2 },
            }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={() => fetchAuditLogs(1, 50)} size="small">
              <RefreshCw size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ height: 580, width: '100%' }}>
        <DataGrid
          rows={auditLogs}
          columns={columns}
          loading={isLoading}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          pageSizeOptions={[20, 50, 100]}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
});
AuditLogsPage.displayName = 'AuditLogsPage';

export default AuditLogsPage;
