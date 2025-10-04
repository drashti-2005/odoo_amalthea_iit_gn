import { apiClient } from './client';
import type { 
  Expense, 
  Category, 
  Receipt, 
  ApiResponse 
} from '../types';

export const expenseApi = {
  async getExpenses(): Promise<ApiResponse<Expense[]>> {
    return apiClient.get('/expenses');
  },

  async getExpense(id: string): Promise<ApiResponse<Expense>> {
    return apiClient.get(`/expenses/${id}`);
  },

  async createExpense(expenseData: Partial<Expense>): Promise<ApiResponse<Expense>> {
    return apiClient.post('/expenses', expenseData);
  },

  async updateExpense(id: string, expenseData: Partial<Expense>): Promise<ApiResponse<Expense>> {
    return apiClient.put(`/expenses/${id}`, expenseData);
  },

  async deleteExpense(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/expenses/${id}`);
  },

  async submitExpense(id: string): Promise<ApiResponse<Expense>> {
    return apiClient.post(`/expenses/${id}/submit`);
  },

  async uploadReceipt(expenseId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<Receipt>> {
    return apiClient.uploadFile(`/expenses/${expenseId}/receipts`, file, onProgress);
  },

  async deleteReceipt(expenseId: string, receiptId: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/expenses/${expenseId}/receipts/${receiptId}`);
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get('/categories');
  },

  async getPendingApprovals(): Promise<ApiResponse<Expense[]>> {
    return apiClient.get('/expenses/pending-approvals');
  },

  async approveExpense(id: string, comment?: string): Promise<ApiResponse<Expense>> {
    return apiClient.post(`/expenses/${id}/approve`, { comment });
  },

  async rejectExpense(id: string, comment: string): Promise<ApiResponse<Expense>> {
    return apiClient.post(`/expenses/${id}/reject`, { comment });
  },
};
