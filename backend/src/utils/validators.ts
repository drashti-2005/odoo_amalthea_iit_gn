import { UserRole } from '../models/user.model';
import { ApprovalType } from '../models/approvalRule.model';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUserRole = (role: string): boolean => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const validateApprovalType = (type: string): boolean => {
  return Object.values(ApprovalType).includes(type as ApprovalType);
};

export const validateCurrency = (currency: string): boolean => {
  const supportedCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
  return supportedCurrencies.includes(currency.toUpperCase());
};

export const validateAmount = (amount: number): boolean => {
  return typeof amount === 'number' && amount > 0 && isFinite(amount);
};

export const validateDate = (date: string | Date): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime()) && dateObj <= new Date();
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateLength = (
  value: string, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  if (typeof value !== 'string') {
    return `${fieldName} must be a string`;
  }
  
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters long`;
  }
  
  if (value.length > max) {
    return `${fieldName} must be no more than ${max} characters long`;
  }
  
  return null;
};

export const validateExpenseData = (data: {
  title: string;
  amount: number;
  currency: string;
  expenseDate: string | Date;
  categoryId: string;
}): string[] => {
  const errors: string[] = [];
  
  // Validate title
  const titleError = validateRequired(data.title, 'Title');
  if (titleError) errors.push(titleError);
  else {
    const lengthError = validateLength(data.title, 2, 100, 'Title');
    if (lengthError) errors.push(lengthError);
  }
  
  // Validate amount
  if (!validateAmount(data.amount)) {
    errors.push('Amount must be a positive number');
  }
  
  // Validate currency
  if (!validateCurrency(data.currency)) {
    errors.push('Invalid currency code');
  }
  
  // Validate date
  if (!validateDate(data.expenseDate)) {
    errors.push('Invalid expense date or date is in the future');
  }
  
  // Validate categoryId
  const categoryError = validateRequired(data.categoryId, 'Category ID');
  if (categoryError) errors.push(categoryError);
  
  return errors;
};

export const validateSignupData = (data: {
  companyName: string;
  baseCurrency: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): string[] => {
  const errors: string[] = [];
  
  // Validate company name
  const companyNameError = validateRequired(data.companyName, 'Company name');
  if (companyNameError) errors.push(companyNameError);
  else {
    const lengthError = validateLength(data.companyName, 2, 100, 'Company name');
    if (lengthError) errors.push(lengthError);
  }
  
  // Validate base currency
  if (!validateCurrency(data.baseCurrency)) {
    errors.push('Invalid base currency');
  }
  
  // Validate email
  const emailError = validateRequired(data.email, 'Email');
  if (emailError) errors.push(emailError);
  else if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }
  
  // Validate first name
  const firstNameError = validateRequired(data.firstName, 'First name');
  if (firstNameError) errors.push(firstNameError);
  else {
    const lengthError = validateLength(data.firstName, 1, 50, 'First name');
    if (lengthError) errors.push(lengthError);
  }
  
  // Validate last name
  const lastNameError = validateRequired(data.lastName, 'Last name');
  if (lastNameError) errors.push(lastNameError);
  else {
    const lengthError = validateLength(data.lastName, 1, 50, 'Last name');
    if (lengthError) errors.push(lengthError);
  }
  
  return errors;
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};