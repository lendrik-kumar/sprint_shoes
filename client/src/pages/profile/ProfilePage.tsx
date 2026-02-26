import React, { useEffect, useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { User, MapPin, Package } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { profileApi } from '@/api';
import type { Address } from '@/types';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid number').optional().or(z.literal('')),
});
type ProfileForm = z.infer<typeof profileSchema>;

const addressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().regex(/^[1-9][0-9]{5}$/),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  isDefault: z.boolean().optional(),
});
type AddressFormData = z.infer<typeof addressSchema>;

const ProfilePage: React.FC = memo(() => {
  const [tab, setTab] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addingAddress, setAddingAddress] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { user, setUser } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  });

  const addressForm = useForm<AddressFormData>({ resolver: zodResolver(addressSchema) });

  useEffect(() => {
    profileApi.getAddresses().then(({ data }: any) => {
      if (data.success) setAddresses(data.data);
    });
  }, []);

  const onProfileSave = async (data: ProfileForm) => {
    setSaving(true);
    try {
      const { data: res } = await profileApi.updateProfile(data as any);
      if (res.success) { setUser(res.data); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 2000); }
    } finally {
      setSaving(false);
    }
  };

  const onAddressAdd = async (data: AddressFormData) => {
    const { data: res }: any = await profileApi.addAddress(data as any);
    if (res.success) { setAddresses((prev) => [...prev, res.data]); setAddingAddress(false); }
  };

  const handleDeleteAddress = async (id: string) => {
    await profileApi.deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Account</h1>

      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} sx={{ mb: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tab label="Personal Info" icon={<User className="w-4 h-4" />} iconPosition="start" />
        <Tab label="Addresses" icon={<MapPin className="w-4 h-4" />} iconPosition="start" />
        <Tab label="Orders" icon={<Package className="w-4 h-4" />} iconPosition="start" />
      </Tabs>

      {/* Tab 0: Personal Info */}
      {tab === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          {saveSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              ✓ Profile updated successfully!
            </div>
          )}
          <form onSubmit={handleSubmit(onProfileSave)} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                <input {...register('firstName')} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
                <input {...register('lastName')} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input {...register('email')} type="email" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone (optional)</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-xl">+91</span>
                <input {...register('phone')} type="tel" maxLength={10} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-r-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 1: Addresses */}
      {tab === 1 && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex justify-between items-start">
              <div>
                {addr.isDefault && <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full mr-2">Default</span>}
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {addr.street}, {addr.city}, {addr.state} — {addr.zip}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">📞 +91 {addr.phone}</p>
              </div>
              <button
                onClick={() => handleDeleteAddress(addr.id)}
                className="text-xs text-red-600 hover:underline ml-4"
              >
                Remove
              </button>
            </div>
          ))}

          {addingAddress ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-orange-200 p-5">
              <form onSubmit={addressForm.handleSubmit(onAddressAdd)} noValidate className="space-y-3">
                <input {...addressForm.register('street')} placeholder="Street address" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <div className="grid grid-cols-2 gap-3">
                  <input {...addressForm.register('city')} placeholder="City" className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <input {...addressForm.register('state')} placeholder="State" className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input {...addressForm.register('zip')} placeholder="PIN Code" maxLength={6} className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <input {...addressForm.register('phone')} placeholder="Mobile" maxLength={10} className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-xl">Save</button>
                  <button type="button" onClick={() => setAddingAddress(false)} className="px-5 py-2 border border-gray-200 dark:border-gray-700 text-sm rounded-xl text-gray-700 dark:text-gray-200">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setAddingAddress(true)}
              className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
            >
              + Add New Address
            </button>
          )}
        </div>
      )}

      {/* Tab 2: Orders redirect */}
      {tab === 2 && (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">View your complete order history</p>
          <a href="/orders" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors">
            <Package className="w-4 h-4" /> View All Orders
          </a>
        </div>
      )}
    </div>
  );
});
ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;
