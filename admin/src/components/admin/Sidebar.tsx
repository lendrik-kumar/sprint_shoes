import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  ScrollText,
  Shield,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Orders', path: '/orders', icon: ShoppingBag },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Toolbar
        sx={{
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: '64px !important',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={18} color="white" />
          </Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            StepStyle
          </Typography>
          <Typography
            variant="caption"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              fontSize: '0.65rem',
              fontWeight: 700,
            }}
          >
            ADMIN
          </Typography>
        </Box>
      </Toolbar>

      {/* Nav */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        <List disablePadding>
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <ListItem key={path} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={path}
                  selected={active}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      '& .MuiListItemIcon-root': { color: 'white' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: active ? 'white' : 'text.secondary' }}>
                    <Icon size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.disabled" textAlign="center" display="block">
          StepStyle Admin v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 0,
            overflowX: 'hidden',
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
