import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

const DRAWER_WIDTH = 240;

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        drawerWidth={DRAWER_WIDTH}
      />
      <Box
        component="div"
        sx={{
          flexGrow: 1,
          ml: { md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
          transition: 'margin 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Topbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
