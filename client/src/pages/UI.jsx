import React from 'react';
import MuiButton from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * Button component wrapper with custom styling
 */
export function Button({
  children,
  onClick,
  fullWidth = false,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const variantMap = {
    primary: 'contained',
    secondary: 'outlined',
  };

  return (
    <MuiButton
      onClick={onClick}
      fullWidth={fullWidth}
      variant={variantMap[variant] || 'contained'}
      disabled={disabled || loading}
      className={className}
      sx={{
        textTransform: 'none',
        fontSize: '0.95rem',
        fontWeight: 500,
        '&:disabled': {
          opacity: 0.6,
        },
      }}
      {...props}
    >
      {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
      {children}
    </MuiButton>
  );
}

/**
 * Spinner component for loading states
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 60,
  };

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 3,
      }}
    >
      <CircularProgress size={sizeMap[size] || 40} />
    </Box>
  );
}

/**
 * Alert component for error/success messages
 */
export function Alert({ type = 'error', message = '', className = '' }) {
  const severityMap = {
    error: 'error',
    success: 'success',
    warning: 'warning',
    info: 'info',
  };

  return (
    <MuiAlert
      severity={severityMap[type] || 'info'}
      className={className}
      sx={{
        mb: 2,
      }}
    >
      {message}
    </MuiAlert>
  );
}
