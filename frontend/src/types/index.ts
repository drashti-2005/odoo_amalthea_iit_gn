export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  company: {
    id: string;
    name: string;
    baseCurrency: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  currency: string;
  description: string;
  status: 'draft' | 'waiting_approval' | 'approved' | 'rejected' | 'paid';
  receipts: Receipt[];
  approvals: ApprovalLog[];
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  user: User;
}

export interface Receipt {
  id: string;
  expenseId: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRule {
  id: string;
  companyId: string;
  categoryId?: string;
  minAmount: number;
  maxAmount?: number;
  approverRole: 'manager' | 'admin';
  sequence: number;
  isPercentageBased: boolean;
  percentage?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalLog {
  id: string;
  expenseId: string;
  approverId: string;
  action: 'approved' | 'rejected';
  comment?: string;
  actionAt: string;
  approver: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  country: string;
  baseCurrency: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
