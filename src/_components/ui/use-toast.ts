import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';

export type ToastVariant = 'default' | 'destructive';

export type Toast = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastListener = (toast: Toast) => void;

const listeners = new Set<ToastListener>();

export function toast(t: Toast) {
  const withId = { id: t.id ?? nanoid(), ...t };
  for (const l of listeners) l(withId);
  return withId.id;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener: ToastListener = (t) => {
      setToasts((prev) => [...prev, t]);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, dismiss };
}
