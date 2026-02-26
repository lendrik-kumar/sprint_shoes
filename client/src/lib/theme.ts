import { createTheme, type Theme } from '@mui/material/styles';

const sharedComponents = {
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
};

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E65100',
      light: '#FF833A',
      dark: '#AC1900',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1565C0',
      light: '#5E92F3',
      dark: '#003C8F',
      contrastText: '#fff',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
  },
  components: sharedComponents,
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF833A',
      light: '#FFB06B',
      dark: '#C65A00',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5E92F3',
      light: '#90C3FF',
      dark: '#1565C0',
      contrastText: '#fff',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
  },
  components: sharedComponents,
});
