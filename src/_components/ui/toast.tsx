import * as React from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg p-4 shadow-lg ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : toast.type === 'error'
              ? 'bg-red-500 text-white'
              : toast.type === 'loading'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800 text-white'
          }`}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.message && <div className="text-sm opacity-90">{toast.message}</div>}
        </div>
      ))}
    </div>
  );
}
