import axios, { AxiosError } from 'axios';

// Base API instance for the client application
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 10000,
});

// Attach unique trace ID to every request for observability
api.interceptors.request.use((config) => {
  config.headers['X-Request-Id'] = crypto.randomUUID();
  return config;
});

// Handle responses and unwrap data for cleaner service calls
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (trigger logout/refresh logic)
    if (error.response?.status === 401 && originalRequest) {
      // In a real app with rotating refresh tokens, we'd try `/auth/refresh` here,
      // but if the refresh token cookie is also expired, we redirect.
      // For now, we dispatch a global event to the auth store to clear state.
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // Normalize error shape to match the backend's AppError payload structure.
    const normalizedError = {
      message: (error.response?.data as any)?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      code: (error.response?.data as any)?.code || 'UNKNOWN_ERROR',
      details: (error.response?.data as any)?.errors || null, // For Zod validation arrays
    };

    return Promise.reject(normalizedError);
  }
);
