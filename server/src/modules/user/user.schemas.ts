import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().datetime().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  newsletters: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
});

export const addressSchema = z.object({
  type: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  name: z.string().optional().nullable(),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
});
