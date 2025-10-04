import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface ApprovalRule {
  id: string;
  name: string;
  description?: string;
  minAmount: number;
  maxAmount?: number;
  currency: string;
  categoryId?: string;
  approvers: ApprovalRuleApprover[];
  isActive: boolean;
  flow: 'sequential' | 'parallel';
  minimumApprovalPercentage?: number;
  managerAsDefaultApprover: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRuleApprover {
  level: number;
  approverId: string;
  isRequired: boolean;
  approver?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface CreateApprovalRuleData {
  name: string;
  description?: string;
  minAmount: number;
  maxAmount?: number;
  currency: string;
  categoryId?: string;
  approvers: Omit<ApprovalRuleApprover, 'approver'>[];
  isActive: boolean;
  flow: 'sequential' | 'parallel';
  minimumApprovalPercentage?: number;
  managerAsDefaultApprover: boolean;
}

export interface UpdateApprovalRuleData {
  name?: string;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  categoryId?: string;
  approvers?: Omit<ApprovalRuleApprover, 'approver'>[];
  isActive?: boolean;
  flow?: 'sequential' | 'parallel';
  minimumApprovalPercentage?: number;
  managerAsDefaultApprover?: boolean;
}

export interface ApprovalRulesResponse {
  rules: ApprovalRule[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApprovalRuleFilters {
  isActive?: boolean;
  categoryId?: string;
  page?: number;
  limit?: number;
}

class ApprovalRulesService {
  // Get all approval rules with optional filtering
  async getApprovalRules(filters?: ApprovalRuleFilters): Promise<ApiResponse<ApprovalRulesResponse>> {
    const params = new URLSearchParams();
    
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/approval-rules?${queryString}` : '/approval-rules';
    
    return apiClient.get<ApprovalRulesResponse>(url);
  }

  // Get approval rule by ID
  async getApprovalRuleById(id: string): Promise<ApiResponse<{ rule: ApprovalRule }>> {
    return apiClient.get<{ rule: ApprovalRule }>(`/approval-rules/${id}`);
  }

  // Create new approval rule
  async createApprovalRule(ruleData: CreateApprovalRuleData): Promise<ApiResponse<{ rule: ApprovalRule }>> {
    return apiClient.post<{ rule: ApprovalRule }>('/approval-rules', ruleData);
  }

  // Update approval rule
  async updateApprovalRule(id: string, ruleData: UpdateApprovalRuleData): Promise<ApiResponse<{ rule: ApprovalRule }>> {
    return apiClient.put<{ rule: ApprovalRule }>(`/approval-rules/${id}`, ruleData);
  }

  // Delete approval rule (if supported)
  async deleteApprovalRule(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/approval-rules/${id}`);
  }

  // Get active approval rules
  async getActiveApprovalRules(): Promise<ApiResponse<ApprovalRulesResponse>> {
    return this.getApprovalRules({ isActive: true });
  }
}

export const approvalRulesService = new ApprovalRulesService();