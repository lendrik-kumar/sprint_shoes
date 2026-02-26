export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const success = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  ...(message && { message }),
  data,
});

export const paginated = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string,
): ApiResponse<T[]> => ({
  success: true,
  ...(message && { message }),
  data,
  pagination: { page, limit, total, pages: Math.ceil(total / limit) },
});

export const created = <T>(data: T, message = 'Created successfully'): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const ok = (message: string): ApiResponse<null> => ({
  success: true,
  message,
  data: null,
});
