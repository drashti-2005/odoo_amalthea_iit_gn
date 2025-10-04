import { useState, useEffect, useCallback } from 'react';
import { userService, type CreateUserData, type UpdateUserData, type UserFilters } from '../api/users';
import { useToast } from './useToast';
import type { User } from '../types';

export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { error: showErrorToast, success: showSuccessToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers(filters);
      setUsers(response.data.users);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, showErrorToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      const response = await userService.createUser(userData);
      await fetchUsers(); // Refresh the list
      showSuccessToast('User created successfully!');
      return response.data.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      showErrorToast(errorMessage);
      throw err;
    }
  }, [fetchUsers, showSuccessToast, showErrorToast]);

  const updateUser = useCallback(async (id: string, userData: UpdateUserData) => {
    try {
      const response = await userService.updateUser(id, userData);
      await fetchUsers(); // Refresh the list
      showSuccessToast('User updated successfully!');
      return response.data.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      showErrorToast(errorMessage);
      throw err;
    }
  }, [fetchUsers, showSuccessToast, showErrorToast]);

  const resetPassword = useCallback(async (id: string) => {
    try {
      await userService.resetUserPassword(id);
      showSuccessToast('Password reset email sent successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      showErrorToast(errorMessage);
      throw err;
    }
  }, [showSuccessToast, showErrorToast]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    resetPassword,
  };
}

export function useManagers() {
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userService.getManagers();
        setManagers(response.data.managers);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch managers';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  return { managers, loading, error };
}

export function useUser(id: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userService.getUserById(id);
        setUser(response.data.user);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { user, loading, error };
}