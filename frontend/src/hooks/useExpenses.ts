import { useState, useCallback } from 'react';
import { expenseApi } from '../api/expenses';
import type { Expense, Category } from '../types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseApi.getExpenses();
      if (response.success) {
        setExpenses(response.data);
      } else {
        setError(response.message || 'Failed to fetch expenses');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await expenseApi.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const createExpense = useCallback(async (expenseData: Partial<Expense>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseApi.createExpense(expenseData);
      if (response.success) {
        setExpenses(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create expense');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateExpense = useCallback(async (id: string, expenseData: Partial<Expense>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseApi.updateExpense(id, expenseData);
      if (response.success) {
        setExpenses(prev => prev.map(expense => 
          expense.id === id ? response.data : expense
        ));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update expense');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseApi.deleteExpense(id);
      if (response.success) {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete expense');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitExpense = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseApi.submitExpense(id);
      if (response.success) {
        setExpenses(prev => prev.map(expense => 
          expense.id === id ? response.data : expense
        ));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to submit expense');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveExpense = useCallback(async (id: string, comment?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseApi.approveExpense(id, comment);
      if (response.success) {
        setExpenses(prev => prev.map(expense => 
          expense.id === id ? response.data : expense
        ));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to approve expense');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rejectExpense = useCallback(async (id: string, comment: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseApi.rejectExpense(id, comment);
      if (response.success) {
        setExpenses(prev => prev.map(expense => 
          expense.id === id ? response.data : expense
        ));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to reject expense');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    expenses,
    categories,
    isLoading,
    error,
    fetchExpenses,
    fetchCategories,
    createExpense,
    updateExpense,
    deleteExpense,
    submitExpense,
    approveExpense,
    rejectExpense,
  };
}
