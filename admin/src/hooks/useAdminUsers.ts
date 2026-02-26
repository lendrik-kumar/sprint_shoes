import { useCallback } from 'react';
import { useUserAdminStore } from '@/stores';
import type { User } from '@/types';

export const useAdminUsers = () => {
  const {
    users,
    selectedUser,
    isLoading,
    error,
    pagination,
    fetchUsers,
    getUserById,
    updateUser,
    toggleUserStatus,
    deleteUser,
    clearSelectedUser,
  } = useUserAdminStore();

  const handleFetchUsers = useCallback(
    async (page?: number, limit?: number, search?: string) => {
      try {
        await fetchUsers(page, limit, search);
      } catch (err) {
        console.error('Fetch users error:', err);
      }
    },
    [fetchUsers]
  );

  const handleGetUserById = useCallback(
    async (id: string) => {
      try {
        await getUserById(id);
      } catch (err) {
        console.error('Get user error:', err);
        throw err;
      }
    },
    [getUserById]
  );

  const handleUpdateUser = useCallback(
    async (id: string, userData: Partial<User>) => {
      try {
        await updateUser(id, userData);
      } catch (err) {
        console.error('Update user error:', err);
        throw err;
      }
    },
    [updateUser]
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        await deleteUser(id);
      } catch (err) {
        console.error('Delete user error:', err);
        throw err;
      }
    },
    [deleteUser]
  );

  return {
    users,
    selectedUser,
    isLoading,
    error,
    pagination,
    fetchUsers: handleFetchUsers,
    getUserById: handleGetUserById,
    updateUser: handleUpdateUser,
    toggleUserStatus,
    deleteUser: handleDeleteUser,
    clearSelectedUser,
  };
};
