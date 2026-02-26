// Shared types for the monorepo
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

export interface UserProfileDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type CheckoutRequest = {
  addressId: string;
  paymentMethod: string;
  notes?: string;
};
