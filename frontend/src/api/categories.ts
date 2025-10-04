import { apiClient } from './client';
import type { ApiResponse, Category } from '../types';

export interface CreateCategoryData {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CategoriesResponse {
  categories: Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryFilters {
  isActive?: boolean;
  page?: number;
  limit?: number;
}

class CategoryService {
  // Get all categories with optional filtering
  async getCategories(filters?: CategoryFilters): Promise<ApiResponse<CategoriesResponse>> {
    const params = new URLSearchParams();
    
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/categories?${queryString}` : '/categories';
    
    return apiClient.get<CategoriesResponse>(url);
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<ApiResponse<{ category: Category }>> {
    return apiClient.get<{ category: Category }>(`/categories/${id}`);
  }

  // Create new category
  async createCategory(categoryData: CreateCategoryData): Promise<ApiResponse<{ category: Category }>> {
    return apiClient.post<{ category: Category }>('/categories', categoryData);
  }

  // Update category
  async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<ApiResponse<{ category: Category }>> {
    return apiClient.put<{ category: Category }>(`/categories/${id}`, categoryData);
  }

  // Delete category
  async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/categories/${id}`);
  }

  // Get active categories (for dropdown selections)
  async getActiveCategories(): Promise<ApiResponse<CategoriesResponse>> {
    return this.getCategories({ isActive: true });
  }
}

export const categoryService = new CategoryService();