import { createTheme, type Theme } from '@mui/material/styles';

export const adminDarkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4338CA',
      contrastText: '#fff',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#fff',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none' as const,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E293B',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
  },
});

export const adminLightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4338CA',
      contrastText: '#fff',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#fff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none' as const,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
