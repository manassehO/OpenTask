'use client';

import { useState, useCallback } from 'react';
import { type Toast, type ToastType } from '~/_components/ui/toast';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      duration?: number,
    ): string => {
      const id = Math.random().toString(36).substring(2, 9);
      const toast: Toast = {
        id,
        type,
        title,
        message,
        duration,
      };

      setToasts((prev) => [...prev, toast]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast)),
    );
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      return addToast('success', title, message);
    },
    [addToast],
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      return addToast('error', title, message);
    },
    [addToast],
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      return addToast('info', title, message);
    },
    [addToast],
  );

  const showLoading = useCallback(
    (title: string, message?: string) => {
      return addToast('loading', title, message, 0); // 0 duration means don't auto-remove
    },
    [addToast],
  );

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    showSuccess,
    showError,
    showInfo,
    showLoading,
  };
}
