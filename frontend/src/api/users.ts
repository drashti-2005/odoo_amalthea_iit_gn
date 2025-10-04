import { apiClient } from './client';
import type { ApiResponse, User } from '../types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'employee';
  managerId?: string;
}

export interface UpdateUserData {
  name?: string;
  role?: 'admin' | 'manager' | 'employee';
  managerId?: string;
  isActive?: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface UserFilters {
  role?: 'admin' | 'manager' | 'employee';
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

class UserService {
  // Get all users with optional filtering
  async getUsers(filters?: UserFilters): Promise<ApiResponse<UsersResponse>> {
    const params = new URLSearchParams();
    
    if (filters?.role) params.append('role', filters.role);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search?.trim()) params.append('search', filters.search.trim());

    const queryString = params.toString();
    const url = queryString ? `/users?${queryString}` : '/users';
    
    return apiClient.get<UsersResponse>(url);
  }

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get<{ user: User }>(`/users/${id}`);
  }

  // Create new user
  async createUser(userData: Omit<CreateUserData, 'password'>): Promise<ApiResponse<{ user: User }>> {
    return apiClient.post<{ user: User }>('/users', userData);
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<{ user: User }>> {
    return apiClient.put<{ user: User }>(`/users/${id}`, userData);
  }

  // Reset user password
  async resetUserPassword(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/auth/users/${id}/send-password`, {});
  }

  // Get managers (for dropdown selections)
  async getManagers(): Promise<ApiResponse<{ managers: User[] }>> {
    return apiClient.get<{ managers: User[] }>('/users/managers');
  }

  // Get all active users (for various dropdowns)
  async getActiveUsers(): Promise<ApiResponse<UsersResponse>> {
    return this.getUsers({ isActive: true });
  }
}

export const userService = new UserService();