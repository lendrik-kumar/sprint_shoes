import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { adminDarkTheme, adminLightTheme } from './lib/theme';
import { useUiStore } from './stores';
import './index.css';

const Root: React.FC = () => {
  const { themeMode } = useUiStore();
  return (
    <ThemeProvider theme={themeMode === 'dark' ? adminDarkTheme : adminLightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
