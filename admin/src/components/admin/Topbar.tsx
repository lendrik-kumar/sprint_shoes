import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { Menu as MenuIcon, Sun, Moon } from 'lucide-react';
import { useAuthStore, useUiStore } from '@/stores';

interface TopbarProps {
  onMenuToggle: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, logout } = useAuthStore();
  const { themeMode, toggleTheme } = useUiStore();
  const navigate = useNavigate();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'A';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton onClick={onMenuToggle} size="small" edge="start">
          <MenuIcon size={20} />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* Theme toggle */}
        <Tooltip title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggleTheme} size="small">
            {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </Tooltip>

        {/* User avatar */}
        <Tooltip title="Account">
          <IconButton onClick={handleOpen} size="small">
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2 } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main', mt: 0.5 }}>
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
