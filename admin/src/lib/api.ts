import axios, { AxiosError } from 'axios';

// Base API instance for the admin application
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  config.headers['X-Request-Id'] = crypto.randomUUID();
  // Admin often needs long lived local storage tokens if we aren't using httpOnly
  // But per architecture specs we are using HTTP only cookies via `withCredentials: true`.
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    // Handle 401/403 (unauthorized/forbidden)
    if ((error.response?.status === 401 || error.response?.status === 403)) {
      window.dispatchEvent(new CustomEvent('admin:unauthorized'));
    }

    const normalizedError = {
      message: (error.response?.data as any)?.message || error.message || 'Admin action failed',
      status: error.response?.status || 500,
      code: (error.response?.data as any)?.code || 'ADMIN_ERROR',
      details: (error.response?.data as any)?.errors || null,
    };

    return Promise.reject(normalizedError);
  }
);
