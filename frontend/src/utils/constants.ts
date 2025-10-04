// Application constants
export const APP_NAME = 'ExpenseFlow';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;

// Expense statuses
export const EXPENSE_STATUS = {
  DRAFT: 'draft',
  WAITING_APPROVAL: 'waiting_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
} as const;

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
  ],
  MAX_FILES: 5,
} as const;

// Form validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  COMPANY_NAME_MIN_LENGTH: 2,
} as const;

// UI Constants
export const ANIMATION = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.5,
  },
  EASE: {
    IN_OUT: 'easeInOut',
    OUT: 'easeOut',
    IN: 'easeIn',
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Default currencies
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
] as const;

// Countries
export const COUNTRIES = [
  'United States',
  'United Kingdom', 
  'Canada',
  'Australia',
  'Germany',
  'France',
  'India',
  'Japan',
  'China',
  'Brazil',
  'Mexico',
  'Italy',
  'Spain',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Switzerland',
  'Austria',
  'Belgium',
] as const;

// Expense categories (default)
export const DEFAULT_CATEGORIES = [
  'Travel',
  'Meals & Entertainment',
  'Office Supplies',
  'Transportation',
  'Accommodation',
  'Training & Education',
  'Software & Subscriptions',
  'Marketing',
  'Communication',
  'Other',
] as const;

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error - please check your connection',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'An unexpected server error occurred',
  VALIDATION_ERROR: 'Please check your input and try again',
  FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image or PDF file',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  SIGNUP_SUCCESS: 'Account created successfully',
  EXPENSE_CREATED: 'Expense created successfully',
  EXPENSE_UPDATED: 'Expense updated successfully',
  EXPENSE_DELETED: 'Expense deleted successfully',
  EXPENSE_SUBMITTED: 'Expense submitted for approval',
  EXPENSE_APPROVED: 'Expense approved successfully',
  EXPENSE_REJECTED: 'Expense rejected',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
} as const;
