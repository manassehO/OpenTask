'use client';

import React, { createContext, useContext } from 'react';
import { ToastContainer } from '~/_components/ui/Toast';
import { useToast } from '~/hooks/useToast';

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toastApi = useToast();

  return (
    <ToastContext.Provider value={toastApi}>
      {children}
      <ToastContainer toasts={toastApi.toasts} onClose={toastApi.removeToast} />
    </ToastContext.Provider>
  );
};

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error('useToastContext must be used within a ToastProvider');
  return ctx;
}
