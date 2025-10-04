import type { Expense } from '../types';

// Mock data for development when backend is not available
export const mockExpenses: Expense[] = [
  {
    id: '1',
    userId: '1',
    categoryId: '1',
    amount: 250.00,
    currency: 'USD',
    description: 'Business lunch with client',
    status: 'approved',
    receipts: [
      {
        id: '1',
        expenseId: '1',
        filename: 'receipt-lunch.pdf',
        url: '/mock/receipt-1.pdf',
        mimeType: 'application/pdf',
        size: 1024000,
        uploadedAt: '2024-10-01T12:00:00Z'
      }
    ],
    approvals: [],
    submittedAt: '2024-10-01T10:00:00Z',
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-10-01T14:00:00Z',
    category: {
      id: '1',
      name: 'Meals & Entertainment',
      description: 'Business meals and entertainment expenses',
      isActive: true,
      companyId: '1',
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z'
    },
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'employee',
      isActive: true,
      company: {
        id: '1',
        name: 'Demo Company',
        baseCurrency: 'USD',
        country: 'US'
      },
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z'
    }
  },
  {
    id: '2',
    userId: '1',
    categoryId: '2',
    amount: 75.50,
    currency: 'USD',
    description: 'Office supplies for Q4',
    status: 'waiting_approval',
    receipts: [],
    approvals: [],
    submittedAt: '2024-10-02T09:00:00Z',
    createdAt: '2024-10-02T09:00:00Z',
    updatedAt: '2024-10-02T09:00:00Z',
    category: {
      id: '2',
      name: 'Office Supplies',
      description: 'Office equipment and supplies',
      isActive: true,
      companyId: '1',
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z'
    },
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'employee',
      isActive: true,
      company: {
        id: '1',
        name: 'Demo Company',
        baseCurrency: 'USD',
        country: 'US'
      },
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z'
    }
  },
  {
    id: '3',
    userId: '1',
    categoryId: '3',
    amount: 1250.00,
    currency: 'USD',
    description: 'Flight to conference in San Francisco',
    status: 'waiting_approval',
    receipts: [
      {
        id: '2',
        expenseId: '3',
        filename: 'flight-receipt.pdf',
        url: '/mock/receipt-2.pdf',
        mimeType: 'application/pdf',
        size: 2048000,
        uploadedAt: '2024-10-03T08:00:00Z'
      }
    ],
    approvals: [],
    submittedAt: '2024-10-03T08:30:00Z',
    createdAt: '2024-10-03T08:30:00Z',
    updatedAt: '2024-10-03T08:30:00Z',
    category: {
      id: '3',
      name: 'Travel',
      description: 'Business travel expenses',
      isActive: true,
      companyId: '1',
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z'
    },
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'employee',
      isActive: true,
      company: {
        id: '1',
        name: 'Demo Company',
        baseCurrency: 'USD',
        country: 'US'
      },
      createdAt: '2024-09-01T00:00:00Z',
      updatedAt: '2024-09-01T00:00:00Z'
    }
  }
];

export const mockApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));