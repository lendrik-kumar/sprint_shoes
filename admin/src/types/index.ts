export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color?: string;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  discountPrice: number;
  discount?: number;
  image: string;
  images?: string[];
  category: Category;
  variants: ProductVariant[];
  rating?: number;
  reviews?: number;
  inStock: boolean;
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Address {
  id: string;
  userId?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  payment?: {
    status: PaymentStatus;
    transactionId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: Order[];
  topProducts: (Product & { sales: number })[];
}

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  userId?: string;
  adminEmail?: string;
  resourceId: string;
  details?: string;
  ipAddress?: string;
  changes?: Record<string, unknown>;
  createdAt: string;
}
