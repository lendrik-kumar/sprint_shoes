import { z } from 'zod';
import { emailSchema, passwordSchema, phoneSchema } from '@utils/validation';

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password required'),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token required'),
  password: passwordSchema,
});

export const phoneOTPSchema = z.object({
  phone: phoneSchema,
});

export const verifyOTPSchema = z.object({
  token: z.string().min(1, 'OTP token required'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});
