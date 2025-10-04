import { useState, useCallback } from 'react';

interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = options.duration || 5000;

    const toast: Toast = {
      id,
      message,
      type: options.type,
      duration,
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return showToast(message, { type: 'success', duration });
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    return showToast(message, { type: 'error', duration });
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return showToast(message, { type: 'warning', duration });
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    return showToast(message, { type: 'info', duration });
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
