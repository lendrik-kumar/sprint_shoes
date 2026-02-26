import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              this.clearAuth();
              window.location.href = '/login';
              return Promise.reject(error);
            }

            const response = await this.instance.post('/auth/refresh', {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  get<T = unknown>(url: string, config?: any) {
    return this.instance.get<T>(url, config);
  }

  post<T = unknown>(url: string, data?: any, config?: any) {
    return this.instance.post<T>(url, data, config);
  }

  put<T = unknown>(url: string, data?: any, config?: any) {
    return this.instance.put<T>(url, data, config);
  }

  patch<T = unknown>(url: string, data?: any, config?: any) {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T = unknown>(url: string, config?: any) {
    return this.instance.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
